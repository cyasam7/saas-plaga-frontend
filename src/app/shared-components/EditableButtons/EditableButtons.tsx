import { Button, Stack } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { IEditableButtons } from './IEditableButtonProps';

function EditableButtons(props: IEditableButtons) {
	const { isEditing, onSave, onCancel, onEdit, onDelete } = props;

	function handleClick() {
		if (isEditing) {
			onSave?.();
		} else {
			onEdit?.();
		}
	}

	return (
		<Stack
			direction="row"
			spacing={1}
		>
			{!isEditing && (
				<Button
					startIcon={<Delete />}
					onClick={onDelete}
					variant="outlined"
					color="secondary"
				>
					Eliminar
				</Button>
			)}
			{isEditing && (
				<Button
					onClick={onCancel}
					color="primary"
					variant="outlined"
				>
					Cancelar
				</Button>
			)}
			<Button
				color="primary"
				variant="contained"
				onClick={handleClick}
			>
				{isEditing ? 'Guardar' : 'Editar'}
			</Button>
		</Stack>
	);
}

export default EditableButtons;
