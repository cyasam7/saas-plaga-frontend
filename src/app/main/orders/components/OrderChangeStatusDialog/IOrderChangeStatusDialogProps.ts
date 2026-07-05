export interface IOrderChangeStatusDialogProps {
	open: boolean;
	id: string;
	onClose: () => void;
}

export interface IStatusForm {
	status: string;
}
