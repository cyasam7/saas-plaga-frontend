import { z } from "zod"

const emptyToUndefined = (schema: z.ZodTypeAny) =>
  z.preprocess((v) => (v === "" || v === null ? undefined : v), schema)

const areaSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "El nombre del área es requerido" }),
  description: z.string().optional(),
})

const locationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "El nombre de la ubicación es requerido" }),
  address: z.string().min(1, { message: "La dirección es requerida" }),
  contactPhone: z.string().min(8, { message: "Ingrese un teléfono válido" }),
  contactPerson: z.string().optional(),
  references: z.string().optional(),
  areas: z.array(areaSchema),
})

export const formSchema = z
  .object({
    type: z.enum(["business", "individual"], {
      required_error: "Seleccione el tipo de cliente",
    }),
    name: z.string().min(2, {
      message: "El nombre debe tener al menos 2 caracteres",
    }),
    // General optional fiscal data
    legalName: z.string().optional(),
    taxpayerType: emptyToUndefined(z.enum(["fisica", "moral"]).optional()),
    rfc: z.string().optional(),
    // Business (B2B)
    businessActivity: z.string().optional(),
    requiresCompliance: z.boolean().default(false),
    locations: z.array(locationSchema).default([]),
    // Residential (individual)
    email: emptyToUndefined(z.string().email({ message: "Ingrese un correo electrónico válido" }).optional()),
    phone: z.string().optional(),
    ownerName: z.string().optional(),
    propertyType: emptyToUndefined(z.enum(["house", "apartment"]).optional()),
  })
  .superRefine((data, ctx) => {
    if (data.type === "business") {
      if (data.locations.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Agregue al menos una ubicación",
          path: ["locations"],
        })
      }
    }

    if (data.type === "individual") {
      if (!data.phone || data.phone.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Ingrese un número de teléfono válido",
          path: ["phone"],
        })
      }
    }
  })

export type FormClientValues = z.infer<typeof formSchema>

export interface NewClientFormProps {
  open: boolean
  onClose: () => void
  onSubmit?: (data: FormClientValues) => void
  defaultValues?: Partial<FormClientValues>
}
