export interface OrderDialogProps {
	open: boolean;
	onSubmit: (orderId: string, shouldOpenDialogAssign: boolean) => Promise<void>;
	onCancel: () => void;
	shouldOpenDialogAssign?: boolean;
	id?: string;
}
