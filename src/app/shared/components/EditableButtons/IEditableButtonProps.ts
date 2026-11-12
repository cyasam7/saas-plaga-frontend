export interface IEditableButtons {
	isEditing: boolean;
	onCancel?: () => void;
	onSave?: () => void;
	onEdit?: () => void;
	onDelete?: () => void;
}
