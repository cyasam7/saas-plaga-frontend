export interface IChangePasswordDialog {
  onClose: () => void;
  open: boolean;
  userId: string;
}

export interface FormChangePassword {
  password: string;
  confirmPassword: string;
}
