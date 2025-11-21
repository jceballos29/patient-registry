import type { DocumentType, PatientType } from "@/lib/generated/prisma/enums"

export type PatientRow = {
  id: string
  name: string
  documentType: DocumentType
  document: string
  type: PatientType
  enteredAt: string
  insurerId: string | null
  insurer: { id: string; name: string } | null
  createdAt: string
  updatedAt: string
}

export type CreatePatientFormValues = {
  name: string
  document: string
  documentType: DocumentType
  type: PatientType
  enteredAt: string
  insurerId?: string | null
}


export type CreatePatientFieldErrors = {
  name?: string[]
  document?: string[]
  documentType?: string[]
  type?: string[]
  enteredAt?: string[]
  insurerId?: string[]
}

export type CreatePatientActionState = {
  status: "idle" | "success" | "error"
  data?: CreatePatientFormValues
  message?: string
  fieldErrors?: CreatePatientFieldErrors
}


export type DeletePatientActionState = {
  status: "idle" | "success" | "error"
  message?: string
  fieldErrors?: {
    id?: string[]
  }
}


export type UpdatePatientFormValues = {
  id: string
  name: string
  document: string
  documentType: DocumentType
  type: PatientType
  enteredAt: string
  insurerId?: string | null
}

export type UpdatePatientFieldErrors = {
  id?: string[]
  name?: string[]
  document?: string[]
  documentType?: string[]
  type?: string[]
  enteredAt?: string[]
  insurerId?: string[]
}

export type UpdatePatientActionState = {
  status: "idle" | "success" | "error"
  data?: UpdatePatientFormValues
  message?: string
  fieldErrors?: UpdatePatientFieldErrors
}