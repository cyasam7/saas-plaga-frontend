import { IFormSaveMembershipData } from '../FormMembership/FormMembershipProps';

export interface IDialogMembershipProps {
  open: boolean;
  membershipId?: string;
  onClose: () => void;
  onSubmit: (data: IFormSaveMembershipData) => void;
}
