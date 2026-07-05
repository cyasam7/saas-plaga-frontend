import { Dayjs } from 'dayjs';
import { UseFormReturn } from 'react-hook-form';
import { EMembershipType } from 'src/app/shared/entities/Memberships';
import * as yup from 'yup';

export interface IFormSaveMembershipProps {
  onSubmit: (data: IFormSaveMembershipData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  membershipId?: string;
  formHandler: UseFormReturn<IFormSaveMembershipData>;
}

export interface IFormSaveMembershipData {
  id?: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  workspaceName: string;
  companyName: string;
  membershipType: EMembershipType;
  dueDate: Dayjs | null;
}

export const schemaSaveMembership = yup.object().shape({
  name: yup.string().required('El nombre es requerido'),
  phone: yup.string().required('El teléfono es requerido'),
  email: yup.string().email('El correo electrónico es inválido').required('El correo electrónico es requerido'),
  password: yup.string().required('La contraseña es requerida'),
  workspaceName: yup.string().required('El nombre del espacio de trabajo es requerido'),
  companyName: yup.string().required('El nombre de la empresa es requerido'),
  membershipType: yup.string().required('El tipo de membresía es requerido'),
  dueDate: yup.mixed().required('La fecha de expiración es requerida')
});
