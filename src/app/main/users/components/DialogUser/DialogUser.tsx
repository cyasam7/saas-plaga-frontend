import React, { useEffect } from 'react';
import FormDialog from 'app/shared/components/FormDialog/FormDialog';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQueryGetUser } from 'src/app/requests/users/useQueryGetUser';
import { useMutationSaveUser } from 'src/app/requests/users/useMutationSaveUser';
import { userKeys } from 'src/app/requests/users/keys';
import { ERoleCode } from 'src/app/requests/users/types';
import useQueryInvalidator from 'src/app/shared/hooks/useQueryInvalidator';
import { displayToast } from 'app/core/feedback/toast';
import FormUser from '../FormUser/FormUser';
import { IDialogUserProps } from './IDialogUserProps';
import { IFormUser } from '../FormUser/IFormUser';
import { userSchema } from '../FormUser/schema';
import { defaultValuesFormUser } from './const';

function DialogUser(props: IDialogUserProps) {
	const { open, userId, onClose } = props;
	const isEditing = !!userId;
	const { invalidate } = useQueryInvalidator();

	const formHandler = useForm<IFormUser>({
		resolver: yupResolver(userSchema),
		context: { isEditing },
		defaultValues: defaultValuesFormUser
	});

	const { data: user, isLoading: isLoadingUser } = useQueryGetUser({ userId }, isEditing);
	const { mutateAsync: saveUser, isLoading: isSavingUser } = useMutationSaveUser();

	useEffect(() => {
		if (user) {
			formHandler.reset({
				...defaultValuesFormUser,
				name: user.name,
				email: user.email,
				phone: user.phone,
				roleId: user.roleCode,
				tenantId: user.tenantId
			});
		}
		return () => {
			formHandler.reset({ ...defaultValuesFormUser });
		};
	}, [user]);

	async function handleSubmit(values: IFormUser): Promise<void> {
		try {
			await saveUser({
				id: userId,
				email: values.email,
				name: values.name,
				phone: values.phone,
				// El select solo ofrece valores de ROLE_CATALOG (ERoleCode) y el schema lo exige.
				roleCode: values.roleId as ERoleCode,
				tenantId: values.tenantId,
				// La contraseña solo se captura al crear; al editar se cambia desde "Cambiar contraseña".
				password: isEditing ? undefined : values.password
			});
			invalidate(userKeys.lists());
			invalidate(userKeys.detail(userId));

			displayToast({
				message: isEditing ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente',
				anchorOrigin: {
					horizontal: 'right',
					vertical: 'top'
				},
				variant: 'success'
			});
			handleClose();
		} catch {
			// AxiosFetcher ya muestra el error; el diálogo queda abierto para corregir.
			invalidate(userKeys.lists());
			invalidate(userKeys.detail(userId));
		}
	}

	function handleClose(): void {
		if (isSavingUser) return;
		formHandler.reset(defaultValuesFormUser);
		onClose();
	}

	return (
		<FormDialog
			open={open}
			onClose={handleClose}
			title={isEditing ? 'Editar usuario' : 'Nuevo usuario'}
			subtitle={isEditing ? 'Actualiza los datos y el rol del usuario.' : 'Registra a un nuevo miembro de tu organización.'}
			onSubmit={formHandler.handleSubmit(handleSubmit)}
			submitLabel={isEditing ? 'Guardar cambios' : 'Crear usuario'}
			isSubmitting={isSavingUser}
			isSubmitDisabled={isEditing && isLoadingUser}
		>
			<FormUser
				loading={isEditing && isLoadingUser}
				isEditing={isEditing}
				hook={formHandler}
			/>
		</FormDialog>
	);
}

export default DialogUser;
