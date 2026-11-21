import { useEffect } from 'react';
import { Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import FormDialog from 'app/shared/components/FormDialog/FormDialog';
import TextFieldForm from 'app/shared/components/Form/TextFieldForm/TextFieldForm';
import { displayToast } from 'app/core/feedback/toast';
import useQueryInvalidator from 'src/app/shared/hooks/useQueryInvalidator';
import { FIELD_REQUIRED } from 'src/app/shared/constants/yupMessages';
import { companyBranchKeys } from 'src/app/requests/company-branches/keys';
import { ICompanyBranchForm } from 'src/app/requests/company-branches/types';
import { useQueryGetCompanyBranchForm } from 'src/app/requests/company-branches/useQueryGetCompanyBranchForm';
import { useMutationSaveCompanyBranch } from 'src/app/requests/company-branches/useMutationSaveCompanyBranch';

export interface CompanyBranchDialogProps {
	open: boolean;
	/** Vacío = alta de sucursal; con id = edición. */
	companyBranchId: string;
	onClose: () => void;
}

const EMPTY_COMPANY_BRANCH_FORM: ICompanyBranchForm = { name: '', address: '' };

const companyBranchSchema = yup.object({
	id: yup.string(),
	name: yup.string().trim().required(FIELD_REQUIRED),
	address: yup.string().trim().required(FIELD_REQUIRED)
});

function CompanyBranchDialog({ open, companyBranchId, onClose }: CompanyBranchDialogProps) {
	const isEditing = Boolean(companyBranchId);
	const { invalidate } = useQueryInvalidator();

	const formHandler = useForm<ICompanyBranchForm>({
		resolver: yupResolver(companyBranchSchema),
		defaultValues: EMPTY_COMPANY_BRANCH_FORM
	});

	const { data: companyBranchFormResponse, isLoading: isLoadingCompanyBranchForm } = useQueryGetCompanyBranchForm(
		{ companyBranchId },
		open && isEditing
	);
	const { mutateAsync: saveCompanyBranch, isLoading: isSavingCompanyBranch } = useMutationSaveCompanyBranch();

	useEffect(() => {
		if (!open) return;

		formHandler.reset(isEditing && companyBranchFormResponse ? companyBranchFormResponse.form : EMPTY_COMPANY_BRANCH_FORM);
	}, [open, isEditing, companyBranchFormResponse, formHandler]);

	async function handleSubmit(companyBranchForm: ICompanyBranchForm): Promise<void> {
		try {
			await saveCompanyBranch(companyBranchForm);
		} catch {
			// AxiosFetcher ya muestra el error; el diálogo queda abierto para corregir.
			return;
		}

		invalidate(companyBranchKeys.all);
		displayToast({
			message: isEditing ? 'Sucursal actualizada correctamente' : 'Sucursal creada correctamente',
			anchorOrigin: { horizontal: 'right', vertical: 'top' },
			variant: 'success'
		});
		onClose();
	}

	return (
		<FormDialog
			open={open}
			onClose={onClose}
			title={isEditing ? 'Editar sucursal' : 'Nueva sucursal'}
			subtitle={isEditing ? 'Actualiza el nombre y la dirección de la sucursal.' : 'Registra una sucursal de tu empresa.'}
			onSubmit={formHandler.handleSubmit(handleSubmit)}
			submitLabel={isEditing ? 'Guardar cambios' : 'Crear sucursal'}
			isSubmitting={isSavingCompanyBranch}
			isSubmitDisabled={isEditing && isLoadingCompanyBranchForm}
		>
			<Stack spacing={2}>
				<TextFieldForm
					name="name"
					control={formHandler.control}
					label="Nombre"
					autoComplete="off"
					autoFocus
					size="small"
					fullWidth
				/>
				<TextFieldForm
					name="address"
					control={formHandler.control}
					label="Dirección"
					autoComplete="off"
					size="small"
					fullWidth
				/>
			</Stack>
		</FormDialog>
	);
}

export default CompanyBranchDialog;
