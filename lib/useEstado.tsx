"use client";

import { useCallback, useSyncExternalStore } from "react";
import { actualizar, snapshot, snapshotServidor, suscribir } from "./almacen";
import type { Estado } from "./estado";

// El estado vive en lib/almacen.ts, fuera de React. Acá solo están los hooks.
// No hace falta un provider: el almacén es un módulo, así que todas las
// secciones ven lo mismo.

/**
 * false durante el render de hidratación, true después. Sirve para no pintar
 * nada que dependa de localStorage o de la fecha del navegador antes de tiempo:
 * el HTML salió del build y no puede saber ninguna de las dos cosas.
 *
 * Los dos snapshots son constantes, así que esto no re-renderiza más de una vez.
 */
const sinSuscripcion = () => () => {};
export function useHidratado(): boolean {
  return useSyncExternalStore(
    sinSuscripcion,
    () => true,
    () => false,
  );
}

/**
 * La fecha de hoy, o null mientras no se hidrate.
 *
 * Nunca en el render del servidor: el sitio es un export estático y un
 * `new Date()` ahí dejaría la fecha del build congelada dentro del HTML, con lo
 * que la cuenta regresiva mostraría un número equivocado para siempre.
 */
export function useHoy(): Date | null {
  return useHidratado() ? new Date() : null;
}

export function useEstado() {
  const estado = useSyncExternalStore(suscribir, snapshot, snapshotServidor);
  const hidratado = useHidratado();

  const marcarRequisito = useCallback((id: string, hecho: boolean) => {
    actualizar((previo) => ({
      ...previo,
      requisitos: {
        ...previo.requisitos,
        [id]: {
          ...previo.requisitos[id],
          hecho,
          fecha: hecho ? new Date().toISOString() : undefined,
        },
      },
    }));
  }, []);

  const anotarRequisito = useCallback((id: string, nota: string) => {
    actualizar((previo) => {
      // El índice de un Record viene tipado como siempre presente, pero en
      // tiempo de ejecución puede no existir: anotar es lo primero que se hace
      // sobre un requisito que nunca se marcó.
      const actual = previo.requisitos[id] as Estado["requisitos"][string] | undefined;
      return {
        ...previo,
        requisitos: {
          ...previo.requisitos,
          [id]: { hecho: actual?.hecho ?? false, fecha: actual?.fecha, nota },
        },
      };
    });
  }, []);

  const responder = useCallback((id: string, respuesta: string) => {
    actualizar((previo) => ({
      ...previo,
      preguntas: { ...previo.preguntas, [id]: { respuesta } },
    }));
  }, []);

  const fijarTipoCambio = useCallback((valor: number) => {
    actualizar((previo) => ({ ...previo, tipoCambio: valor }));
  }, []);

  const alternarDescarte = useCallback((id: string) => {
    actualizar((previo) => ({
      ...previo,
      programasDescartados: previo.programasDescartados.includes(id)
        ? previo.programasDescartados.filter((x) => x !== id)
        : [...previo.programasDescartados, id],
    }));
  }, []);

  return {
    estado,
    hidratado,
    marcarRequisito,
    anotarRequisito,
    responder,
    fijarTipoCambio,
    alternarDescarte,
  };
}
