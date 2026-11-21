import { useEffect } from 'react';
import { Stack } from '@mui/material';
import FormDialog from 'app/shared/components/FormDialog/FormDialog';
import { useForm } from 'react-hook-form';
import TextFieldForm from 'app/shared/components/Form/TextFieldForm/TextFieldForm';
import { INamedCatalogItem, ISaveNamedCatalogPayload } from 'src/app/requests/catalogs/types';
import { INamedCatalogLabels } from './types';

const EMPTY_FORM: ISaveNamedCatalogPayload = { id: '', name: '', description: '' };

type NamedCatalogDialogProps = {
	open: boolean;
	selectedCatalogItem: INamedCatalogItem | null;
	labels: INamedCatalogLabels;
	onClose: () => void;
	onSubmit: (catalogItemForm: ISaveNamedCatalogPayload) => Promise<void> | void;
};

export function NamedCatalogDialog({
	open,
	selectedCatalogItem,
	labels,
	onClose,
	onSubmit
}: NamedCatalogDialogProps) {
	const isEditing = selectedCatalogItem !== null;
	const {
		control,
		handleSubmit,
		reset,
		formState: { isSubmitting }
	} = useForm<ISaveNamedCatalogPayload>({ defaultValues: EMPTY_FORM });

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
		<FormDialog
			open={open}
			onClose={handleClose}
			title={isEditing ? `Editar ${labels.singular}` : `Nuevo ${labels.singular}`}
			subtitle={isEditing ? `Modifica los datos del ${labels.singular}.` : `Agrega un nuevo ${labels.singular} al catálogo.`}
			onSubmit={handleSubmit(onSubmit)}
			submitLabel={isEditing ? 'Guardar cambios' : `Crear ${labels.singular}`}
			isSubmitting={isSubmitting}
		>
			<Stack spacing={2}>
				<TextFieldForm<ISaveNamedCatalogPayload>
					control={control}
					name="name"
					label="Nombre"
					size="small"
					fullWidth
					autoFocus
				/>
				<TextFieldForm<ISaveNamedCatalogPayload>
					control={control}
					name="description"
					label="Descripción"
					size="small"
					fullWidth
					multiline
					rows={4}
				/>
			</Stack>
		</FormDialog>
	);
}
