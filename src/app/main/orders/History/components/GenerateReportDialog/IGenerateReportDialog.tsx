export interface IGenerateReportDialogProps {
	id: string;
	open: boolean;
	onClose: () => void;
	onSubmit?: () => Promise<void>;
}
