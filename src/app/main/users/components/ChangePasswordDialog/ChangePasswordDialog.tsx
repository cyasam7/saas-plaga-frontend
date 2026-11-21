import React from 'react';
import { Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormDialog from 'app/shared/components/FormDialog/FormDialog';
import { TextFieldPasswordForm } from 'app/shared/components/Form/TextFieldForm/PasswordInputForm';
import { useMutationChangeUserPassword } from 'src/app/requests/users/useMutationChangeUserPassword';
import { userKeys } from 'src/app/requests/users/keys';
import { displayToast } from 'app/core/feedback/toast';
import { useQueryClient } from 'react-query';
import {
	FIELD_PASSWORD_MUST_BE_SAME,
	FIELD_PASSWORD_SHORT,
	FIELD_REQUIRED
} from 'src/app/shared/constants/yupMessages';
import { FormChangePassword, IChangePasswordDialog } from './IChangePasswordDialog';

const changePasswordSchema = yup.object().shape({
	password: yup.string().required(FIELD_REQUIRED).min(8, FIELD_PASSWORD_SHORT),
	confirmPassword: yup
		.string()
		.required(FIELD_REQUIRED)
		.oneOf([yup.ref('password')], FIELD_PASSWORD_MUST_BE_SAME)
});

const emptyPasswordForm: FormChangePassword = { password: '', confirmPassword: '' };

function ChangePasswordDialog(props: IChangePasswordDialog) {
	const { onClose, open, userId } = props;
	const queryClient = useQueryClient();
	const { mutateAsync: changeUserPassword, isLoading: isChangingPassword } = useMutationChangeUserPassword();

	const formHandler = useForm<FormChangePassword>({
		resolver: yupResolver(changePasswordSchema),
		defaultValues: emptyPasswordForm
	});

	function handleClose() {
		if (isChangingPassword) return;
		formHandler.reset(emptyPasswordForm);
		onClose();
	}

	async function onSubmit(passwordForm: FormChangePassword): Promise<void> {
		try {
			await changeUserPassword({ userId, password: passwordForm.password });
		} catch {
			// AxiosFetcher ya muestra el error; el diálogo queda abierto para reintentar.
			return;
		}
		queryClient.invalidateQueries(userKeys.lists());
		displayToast({
			anchorOrigin: {
				horizontal: 'right',
				vertical: 'top'
			},
			message: 'Contraseña actualizada correctamente',
			variant: 'success'
		});
		formHandler.reset(emptyPasswordForm);
		onClose();
	}

	return (
		<FormDialog
			open={open}
			onClose={handleClose}
			maxWidth="xs"
			title="Cambiar contraseña"
			subtitle="Mínimo 8 caracteres."
			onSubmit={formHandler.handleSubmit(onSubmit)}
			submitLabel="Cambiar contraseña"
			isSubmitting={isChangingPassword}
		>
			<Stack spacing={2}>
				<TextFieldPasswordForm
					name="password"
					label="Nueva contraseña"
					control={formHandler.control}
					size="small"
					autoComplete="new-password"
					fullWidth
				/>
				<TextFieldPasswordForm
					name="confirmPassword"
					label="Confirmar contraseña"
					control={formHandler.control}
					size="small"
					autoComplete="new-password"
					fullWidth
				/>
			</Stack>
		</FormDialog>
	);
}

export default ChangePasswordDialog;
