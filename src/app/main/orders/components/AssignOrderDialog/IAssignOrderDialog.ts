export interface IAssignOrderDialog {
	orderId: string;
	open: boolean;
	onClose: () => void;
}

export interface IAssignOrderForm {
	userId: string;
}
