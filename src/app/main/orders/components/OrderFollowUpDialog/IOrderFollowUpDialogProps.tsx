export interface IOrderFollowUpDialogProps {
	id: string;
	open: boolean;
	onClose: () => void;
	onSubmit: () => Promise<void>;
}
