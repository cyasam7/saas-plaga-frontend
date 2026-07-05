import { Branch } from '../../types';
import { z } from 'zod';

export const formSchema = z.object({
  id: z.string().optional(),
  clientId: z.string(),
  name: z.string().min(1, {
    message: 'El nombre de la ubicación es requerido'
  }),
  address: z.string().min(1, {
    message: 'La dirección es requerida'
  }),
  // On-site responsible person is optional (matches the client entity / location sub-form)
  contactPerson: z.string().optional(),
  contactPhone: z.string().min(8, {
    message: 'Ingrese un teléfono válido'
  }),
  notes: z.string().optional()
});

export type FormBranchValues = z.infer<typeof formSchema>;

export interface BranchFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (branch: Branch) => void;
  branch: Branch | null;
  isEditing: boolean;
  clientId: string;
}
