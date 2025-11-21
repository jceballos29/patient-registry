import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  DocumentType as DocumentTypeEnum,
  PatientType as PatientTypeEnum,
  type DocumentType as DocumentTypeValue,
  type PatientType as PatientTypeValue,
} from '@/lib/generated/prisma/enums';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const documentTypeOptions: Array<{
  value: DocumentTypeValue;
  label: string;
  description: string;
  className: string;
}> = [
    {
      value: DocumentTypeEnum.RC,
      label: 'RC',
      description: 'Registro civil',
      className: 'bg-indigo-100 text-indigo-800'
    },
    {
      value: DocumentTypeEnum.TI,
      label: 'TI',
      description: 'Tarjeta de identidad',
      className: 'bg-sky-100 text-sky-800'
    },
    {
      value: DocumentTypeEnum.XDE,
      label: 'XDE',
      description: 'Documento extranjero',
      className: 'bg-teal-100 text-teal-800'
    },
    {
      value: DocumentTypeEnum.CC,
      label: 'CC',
      description: 'Cédula de ciudadanía',
      className: 'bg-amber-100 text-amber-800'
    }
  ];

export const getDocumentType = (value: DocumentTypeValue) => {
  const option = documentTypeOptions.find(option => option.value === value);
  return option;
};

export const patientTypeOptions: Array<{
  value: PatientTypeValue;
  title: string;
  description: string;
  className: string;
}> = [
    {
      value: PatientTypeEnum.SESSIONS,
      title: 'Por sesiones',
      description:
        'El paciente paga cada cita de forma independiente y debe registrar un valor por sesión.',
      className: 'bg-blue-100 text-blue-800'
    },
    {
      value: PatientTypeEnum.AUTHORIZATIONS,
      title: 'Por autorizaciones',
      description:
        'El paciente trabaja con paquetes autorizados. No requiere un precio fijo por sesión.',
      className: 'bg-green-100 text-green-800',
    },
  ];

export const getPatientType = (value: PatientTypeValue) => {
  const option = patientTypeOptions.find(option => option.value === value);
  return option
}

export function getFieldErrors<K extends Record<string, string[] | undefined>>(
  field: keyof K,
  fieldErrors: K
): Array<{ message: string }> | undefined {
  const errors = fieldErrors[field];
  if (!errors) return undefined;
  return errors.map((message) => ({ message }));
}

/* ------------------------------ Internacionalización ------------------------------ */

/**
 * Configuración de locale para formateo de fechas
 */
export const LOCALE = 'es-CO';

/**
 * Opciones de formato de fecha para visualización en tablas
 */
export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

/**
 * Formatea una fecha usando la configuración de locale
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(LOCALE, DATE_FORMAT_OPTIONS);
}
