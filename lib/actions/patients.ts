"use server";

import { Patient, Prisma } from "@/lib/generated/prisma/client";
import {
  DocumentType as DocumentTypeEnum,
  PatientType as PatientTypeEnum,
  type DocumentType as DocumentTypeValue,
  type PatientType as PatientTypeValue,
} from "@/lib/generated/prisma/enums";
import type {
  CreatePatientActionState,
  CreatePatientFormValues,
  DeletePatientActionState,
  PatientRow,
  UpdatePatientActionState,
} from "@/types/patients";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import prisma from "../prisma";
import { z } from "zod";

/* ------------------------------ Helpers ------------------------------ */

const enumDocumentTypes = new Set<DocumentTypeValue>(
  Object.values(DocumentTypeEnum) as DocumentTypeValue[]
);
const enumPatientTypes = new Set<PatientTypeValue>(
  Object.values(PatientTypeEnum) as PatientTypeValue[]
);

const isDocumentType = (val: string): val is DocumentTypeValue =>
  enumDocumentTypes.has(val as DocumentTypeValue);

const isPatientType = (val: string): val is PatientTypeValue =>
  enumPatientTypes.has(val as PatientTypeValue);

function readForm(formData: FormData, fields: string[]) {
  const result: Record<string, string> = {};
  for (const field of fields) {
    const v = formData.get(field);
    result[field] = typeof v === "string" ? v.trim() : "";
  }
  return result;
}

/* ------------------------------ Schemas ------------------------------ */

const documentTypeSchema = z.string().refine(isDocumentType, {
  message: "Selecciona un tipo válido.",
});

const patientTypeSchema = z.string().refine(isPatientType, {
  message: "Selecciona el tipo de paciente.",
});

// Validación del precio sin ZodIssue, modernizada
const priceSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (val) => {
      if (!val) return true;
      const n = Number(val);
      return Number.isFinite(n) && n > 0;
    },
    { message: "El precio debe ser un número positivo." }
  )
  .transform((val) => (val ? Number(val) : null));

const createPatientSchema = z
  .object({
    name: z.string().trim().min(1, "El nombre es obligatorio."),
    document: z.string().trim().min(1, "El documento es obligatorio."),
    documentType: documentTypeSchema,
    type: patientTypeSchema,
    defaultSessionPrice: priceSchema,
    enteredAt: z.string().trim().min(1, "La fecha de ingreso es obligatoria.").refine(
      (val) => {
        const date = new Date(val);
        const now = new Date();
        return !isNaN(date.getTime()) && date <= now;
      },
      { message: "La fecha no puede ser futura." }
    ),
    insurerId: z.string().trim().optional().transform((val) => val || null),
  })
  .superRefine((data, ctx) => {
    if (data.type === PatientTypeEnum.SESSIONS && data.defaultSessionPrice == null) {
      ctx.addIssue({
        code: "custom",
        message: "Ingresa el valor por sesión.",
        path: ["defaultSessionPrice"],
      });
    }
  });

const updatePatientSchema = createPatientSchema.safeExtend({
  id: z.string().trim().min(1, "Paciente inválido."),
});

const deletePatientSchema = z.object({
  id: z.string().trim().min(1, "Paciente inválido."),
});

/* ------------------------------ Actions ------------------------------ */

export async function createPatientAction(prevState: CreatePatientActionState, formData: FormData): Promise<CreatePatientActionState> {
  const raw = readForm(formData, [
    "name",
    "document",
    "documentType",
    "type",
    "defaultSessionPrice",
    "enteredAt",
    "insurerId",
  ]);

  const parsed = createPatientSchema.safeParse(raw);

  if (!parsed.success) {
    const flattenedErrors = z.flattenError(parsed.error)
    return {
      status: "error",
      data: raw as CreatePatientFormValues,
      message: "Revisa la información ingresada.",
      fieldErrors: flattenedErrors.fieldErrors,
    };
  }

  const data = parsed.data;

  try {
    await prisma.patient.create({
      data: {
        name: data.name,
        document: data.document,
        documentType: data.documentType as DocumentTypeValue,
        type: data.type as PatientTypeValue,
        enteredAt: new Date(data.enteredAt),
        insurerId: data.insurerId || null,
      },
    });

    revalidatePath("/patients");

    return {
      status: "success",
      message: "Paciente creado correctamente.",
    };
  } catch (error) {
    console.error(error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        status: "error",
        message: "No se pudo crear el paciente.",
        fieldErrors: { document: ["Ya existe un paciente con este documento."] },
      };
    }

    return {
      status: "error",
      message: "Ocurrió un error inesperado. Intenta nuevamente.",
    };
  }
}

export async function updatePatientAction(
  _prevState: UpdatePatientActionState,
  formData: FormData
): Promise<UpdatePatientActionState> {
  const raw = readForm(formData, [
    "id",
    "name",
    "document",
    "documentType",
    "type",
    "defaultSessionPrice",
    "enteredAt",
    "insurerId",
  ]);

  const parsed = updatePatientSchema.safeParse(raw);

  if (!parsed.success) {
    const flattenedErrors = z.flattenError(parsed.error)
    return {
      status: "error",
      message: "Revisa la información ingresada.",
      fieldErrors: flattenedErrors.fieldErrors,
    };
  }

  const data = parsed.data;

  try {
    await prisma.patient.update({
      where: { id: data.id },
      data: {
        name: data.name,
        document: data.document,
        documentType: data.documentType as DocumentTypeValue,
        type: data.type as PatientTypeValue,
        enteredAt: new Date(data.enteredAt),
        insurerId: data.insurerId || null,
      },
    });

    revalidatePath("/patients");

    return {
      status: "success",
      message: "Paciente actualizado correctamente.",
    };
  } catch (error) {
    console.error(error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        status: "error",
        message: "No se pudo actualizar el paciente.",
        fieldErrors: { document: ["Ya existe un paciente con este documento."] },
      };
    }

    return {
      status: "error",
      message: "Ocurrió un error inesperado. Intenta nuevamente.",
    };
  }
}

export async function deletePatientAction(
  _prevState: DeletePatientActionState,
  formData: FormData
): Promise<DeletePatientActionState> {
  const raw = readForm(formData, ["id"]);
  const parsed = deletePatientSchema.safeParse(raw);

  if (!parsed.success) {
    const flattenedErrors = z.flattenError(parsed.error)
    return {
      status: "error",
      message: "Paciente inválido.",
      fieldErrors: flattenedErrors.fieldErrors,
    };
  }

  try {
    await prisma.patient.delete({ where: { id: parsed.data.id } });

    revalidatePath("/patients");

    return { status: "success", message: "Paciente eliminado correctamente." };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "No se pudo eliminar el paciente.",
    };
  }
}

/* ------------------------------ Queries ------------------------------ */

const mapPatientToRow = (patient: Patient & { insurer?: { id: string; name: string } | null }): PatientRow => ({
  id: patient.id,
  name: patient.name,
  documentType: patient.documentType,
  document: patient.document,
  type: patient.type,
  enteredAt: patient.enteredAt.toISOString(),
  insurerId: patient.insurerId,
  insurer: patient.insurer || null,
  createdAt: patient.createdAt.toISOString(),
  updatedAt: patient.updatedAt.toISOString(),
});

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
 * Obtiene la lista de pacientes con sus aseguradoras.
 * Esta función está cacheada para mejorar el rendimiento.
 */
export const getPatients = cache(async (): Promise<PatientRow[]> => {
  try {
    const patients = await retryOperation(() =>
      prisma.patient.findMany({
        include: {
          insurer: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    );
    return patients.map(mapPatientToRow);
  } catch (err) {
    console.error('Error fetching patients:', err);
    // Retornar array vacío en lugar de lanzar error para evitar crash total
    const isPrismaConnectionError =
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P1001';

    if (isPrismaConnectionError) {
      console.error('No se pudo conectar a la base de datos después de varios intentos');
      return [];
    }
    throw err;
  }
});

export async function getPatientByIdAction(id: string): Promise<PatientRow | null> {
  try {
    const patient = await retryOperation(() =>
      prisma.patient.findUnique({
        where: { id },
        include: {
          insurer: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })
    );
    return patient ? mapPatientToRow(patient) : null;
  } catch (err) {
    console.error('Error fetching patient by id:', err);
    const isPrismaConnectionError =
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P1001';

    if (isPrismaConnectionError) {
      return null;
    }
    throw err;
  }
}


