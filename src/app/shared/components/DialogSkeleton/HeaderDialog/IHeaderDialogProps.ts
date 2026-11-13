export interface IHeaderDialogProps {
	onClickSecondaryButton: () => void;
	onClickPrimaryButton: () => void;
	textPrimaryButton?: string;
	textSecondaryButton?: string;
	title?: string;
	justifyContent?: 'flex-end' | 'flex-start' | 'space-between';
}
