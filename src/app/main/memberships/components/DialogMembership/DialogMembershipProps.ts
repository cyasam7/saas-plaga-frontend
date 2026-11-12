import { IFormSaveMembershipData } from '../FormMembership/FormMembershipProps';

export interface IDialogMembershipProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: IFormSaveMembershipData) => void;
}
