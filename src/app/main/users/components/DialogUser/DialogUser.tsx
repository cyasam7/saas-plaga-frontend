import React, { useEffect } from 'react';
import DialogSkeleton from 'app/shared/components/DialogSkeleton/DialogSkeleton';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import HeaderDialog from 'app/shared/components/DialogSkeleton/HeaderDialog/HeaderDialog';
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
	const { invalidate } = useQueryInvalidator();

	const formHandler = useForm<IFormUser>({
		resolver: yupResolver(userSchema),
		defaultValues: defaultValuesFormUser
	});

	const { data, isLoading } = useQueryGetUser({ userId }, !!userId);
	const { mutateAsync: saveUser } = useMutationSaveUser();

	useEffect(() => {
		if (data) {
			formHandler.reset({
				name: data.name,
				email: data.email,
				phone: data.phone,
				roleId: data.roleCode,
				tenantId: data.tenantId
			});
		}
		return () => {
			formHandler.reset({ ...defaultValuesFormUser });
		};
	}, [data]);

	async function handleSubmit(values: IFormUser): Promise<void> {
		try {
			if (values.password !== values.confirmPassword) {
				formHandler.setError('confirmPassword', {
					message: 'Las contraseñas no coinciden'
				});
				return;
			}
			await saveUser({
				id: userId,
				email: values.email,
				name: values.name,
				phone: values.phone,
				// El select solo ofrece valores de ROLE_CATALOG (ERoleCode) y el schema lo exige.
				roleCode: values.roleId as ERoleCode,
				tenantId: values.tenantId,
				password: values.password
			});
			invalidate(userKeys.lists());
			invalidate(userKeys.detail(userId));

			displayToast({
				message: 'Usuario guardado correctamente',
				anchorOrigin: {
					horizontal: 'right',
					vertical: 'top'
				},
				variant: 'success'
			});
			handleClose();
		} catch {
			invalidate(userKeys.lists());
			invalidate(userKeys.detail(userId));
		}
	}

	function handleClose(): void {
		formHandler.reset(defaultValuesFormUser);
		onClose();
	}

	return (
		<DialogSkeleton
			open={open}
			maxWidth="md"
			header={
				<HeaderDialog
					title="Registro de usuario"
					onClickSecondaryButton={onClose}
					onClickPrimaryButton={formHandler.handleSubmit(handleSubmit)}
				/>
			}
			content={
				<FormUser
					loading={isLoading}
					isEditing={!!userId}
					hook={formHandler}
				/>
			}
		/>
	);
}

export default DialogUser;
