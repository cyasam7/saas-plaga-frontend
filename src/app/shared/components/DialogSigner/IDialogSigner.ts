export interface IDialogSignerProps {
	onSubmit: (value: Blob) => Promise<void> | void;
	onClose: () => void;
	open: boolean;
}
