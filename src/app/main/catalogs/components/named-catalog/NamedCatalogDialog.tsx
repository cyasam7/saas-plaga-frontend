import { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { Box, useTheme } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import TextFieldForm from 'app/shared/components/Form/TextFieldForm/TextFieldForm';
import { INamedCatalogItem, ISaveNamedCatalogPayload } from 'src/app/requests/catalogs/types';
import { INamedCatalogLabels, NamedCatalogAccentColor } from './types';

const EMPTY_FORM: ISaveNamedCatalogPayload = { id: '', name: '', description: '' };

type NamedCatalogDialogProps = {
	open: boolean;
	selectedCatalogItem: INamedCatalogItem | null;
	labels: INamedCatalogLabels;
	Icon: SvgIconComponent;
	accentColor: NamedCatalogAccentColor;
	onClose: () => void;
	onSubmit: (catalogItemForm: ISaveNamedCatalogPayload) => void;
};

export function NamedCatalogDialog({
	open,
	selectedCatalogItem,
	labels,
	Icon,
	accentColor,
	onClose,
	onSubmit
}: NamedCatalogDialogProps) {
	const theme = useTheme();
	const accentPalette = theme.palette[accentColor];
	const isEditing = selectedCatalogItem !== null;
	const { control, handleSubmit, reset } = useForm<ISaveNamedCatalogPayload>({ defaultValues: EMPTY_FORM });

	useEffect(() => {
		reset(
			selectedCatalogItem
				? {
						id: selectedCatalogItem.id,
						name: selectedCatalogItem.name,
						description: selectedCatalogItem.description
					}
				: EMPTY_FORM
		);
	}, [selectedCatalogItem, reset, open]);

	function handleClose() {
		reset(EMPTY_FORM);
		onClose();
	}

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			PaperProps={{ sx: { minWidth: '500px' } }}
		>
			<Box
				sx={{
					backgroundColor: accentPalette.main,
					color: accentPalette.contrastText,
					p: 2,
					display: 'flex',
					alignItems: 'center',
					gap: 1
				}}
			>
				<Icon />
				<DialogTitle sx={{ p: 0, color: 'inherit' }}>
					{isEditing ? `Editar ${labels.singularTitle}` : `Nuevo ${labels.singularTitle}`}
				</DialogTitle>
			</Box>
			<DialogContent>
				<DialogContentText sx={{ mt: 2 }}>
					{isEditing
						? `Modifica los datos del ${labels.singular}.`
						: `Agrega un nuevo ${labels.singular} al catálogo.`}
				</DialogContentText>
				<form onSubmit={handleSubmit(onSubmit)}>
					<TextFieldForm<ISaveNamedCatalogPayload>
						control={control}
						name="name"
						label="Nombre"
						fullWidth
						autoFocus
						margin="dense"
						sx={{ mt: 2 }}
					/>
					<TextFieldForm<ISaveNamedCatalogPayload>
						control={control}
						name="description"
						label="Descripción"
						fullWidth
						multiline
						rows={4}
						margin="dense"
						sx={{ mt: 2 }}
					/>
					<DialogActions>
						<Button
							onClick={handleClose}
							color="inherit"
						>
							Cancelar
						</Button>
						<Button
							type="submit"
							variant="contained"
							color={accentColor}
							sx={{ color: accentPalette.contrastText }}
						>
							{isEditing ? 'Actualizar' : 'Guardar'}
						</Button>
					</DialogActions>
				</form>
			</DialogContent>
		</Dialog>
	);
}
