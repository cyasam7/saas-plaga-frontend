export interface IOrderFollowUpDialogProps {
	id: string;
	/** Fecha (ISO) de la orden de referencia: el seguimiento debe programarse después. */
	referenceOrderDate: string | null;
	open: boolean;
	onClose: () => void;
	onSubmit: () => Promise<void>;
}
