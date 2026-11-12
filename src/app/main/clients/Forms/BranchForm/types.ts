import { z } from 'zod';

export const branchFormSchema = z.object({
  name: z.string().min(1, { message: 'El nombre de la ubicación es requerido' }),
  address: z.string().min(1, { message: 'La dirección es requerida' }),
  contactPhone: z.string().min(8, { message: 'Ingrese un teléfono válido' }),
  contactPerson: z.string().nullable(),
  notes: z.string().nullable(),
  areas: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().trim().min(1, { message: 'El nombre del área es requerido' }),
        description: z.string().nullable()
      })
    )
    .min(1, { message: 'Agregue al menos un área' })
});

export interface BranchFormProps {
  open: boolean;
  clientId: string;
  /** Sucursal a editar; vacío = alta de una nueva sucursal. */
  branchId: string;
  onClose: () => void;
  onSaved: () => Promise<void>;
}
