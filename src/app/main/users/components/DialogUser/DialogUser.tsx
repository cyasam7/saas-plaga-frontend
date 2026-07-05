import React, { useEffect } from 'react';
import DialogSkeleton from 'app/shared-components/DialogSkeleton/DialogSkeleton';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import HeaderDialog from 'app/shared-components/DialogSkeleton/HeaderDialog/HeaderDialog';
import { UserService } from 'src/app/shared/services/UserService';
import useQueryInvalidator from 'src/app/shared-hooks/useQueryInvalidator';
import { useQuery } from 'react-query';
import { displayToast } from '@fuse/core/FuseMessage/DisplayToast';
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

	const { data, isLoading } = useQuery({
		queryFn: () => UserService.getById(userId),
		queryKey: [userId],
		enabled: !!userId
	});

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
			await UserService.save({
				id: userId,
				email: values.email,
				name: values.name,
				phone: values.phone,
				roleCode: values.roleId,
				tenantId: values.tenantId,
				password: values.password
			});
			invalidate('users-registered');
			invalidate([userId]);

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
			invalidate('users-registered');
			invalidate([userId]);
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
