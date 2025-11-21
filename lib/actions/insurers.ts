"use server";

import { Prisma } from "@/lib/generated/prisma/client";
import prisma from "../prisma";
import { cache } from "react";

// Función auxiliar para reintentar operaciones de base de datos
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Solo reintentar en errores de conexión
      const isPrismaConnectionError =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P1001';

      if (isPrismaConnectionError && attempt < maxRetries) {
        console.warn(
          `Intento ${attempt}/${maxRetries} falló. Reintentando en ${delayMs}ms...`,
          error.message
        );
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
        continue;
      }

      throw error;
    }
  }

  throw lastError;
}

/**
 * Obtiene la lista de aseguradoras ordenadas alfabéticamente.
 * Esta función está cacheada para mejorar el rendimiento.
 */
export const getInsurers = cache(async (): Promise<{ id: string; name: string }[]> => {
  try {
    const insurers = await retryOperation(() =>
      prisma.insurer.findMany({
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: "asc" },
      })
    );
    return insurers;
  } catch (err) {
    console.error('Error fetching insurers:', err);
    const isPrismaConnectionError =
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P1001';

    if (isPrismaConnectionError) {
      return [];
    }
    throw err;
  }
});
