import React from 'react';
import { MenuItem, Stack, Typography } from '@mui/material';
import TextFieldForm from 'app/shared/components/Form/TextFieldForm/TextFieldForm';
import FormDialog from 'app/shared/components/FormDialog/FormDialog';
import { useForm } from 'react-hook-form';
import { useGlobalDialog } from 'app/shared/components/GlobalDialog/GlobalDialogContext';
import { useQueryClient } from 'react-query';
import { useQueryFumigatorsToAssignOrder } from 'src/app/requests/orders/useQueryFumigatorsToAssignOrder';
import { useMutationAssignOrder } from 'src/app/requests/orders/useMutationAssignOrder';
import { orderKeys } from 'src/app/requests/orders/keys';
import { displayToast } from 'app/core/feedback/toast';
import { IAssignOrderDialog, IAssignOrderForm } from './IAssignOrderDialog';

function AssignOrderDialog(props: IAssignOrderDialog) {
	const { openDialog } = useGlobalDialog();
	const { onClose, open, orderId } = props;
	const queryClient = useQueryClient();

	const { data: fumigators = [], isLoading } = useQueryFumigatorsToAssignOrder();
	const { mutateAsync: assignOrder } = useMutationAssignOrder();

	const formHandler = useForm<IAssignOrderForm>({
		defaultValues: {
			userId: ''
		}
	});

	async function successRequest({ userId }: IAssignOrderForm): Promise<void> {
		try {
			await assignOrder({
				orderId,
				userId
			});
			displayToast({
				anchorOrigin: {
					horizontal: 'right',
					vertical: 'top'
				},
				autoHideDuration: 4000,
				message: 'Se a actualizado correctamente',
				variant: 'success'
			});
			await queryClient.invalidateQueries(orderKeys.all);
			handleClose();
		} catch {
			displayToast({
				anchorOrigin: {
					horizontal: 'right',
					vertical: 'top'
				},
				autoHideDuration: 4000,
				message: 'Algo salio mal',
				variant: 'error'
			});
		}
	}

	async function onSubmit(formValues: IAssignOrderForm): Promise<void> {
		openDialog({
			title: 'Confirmación requerida',
			text: '¿Estas seguro que deseas confirmar orden?, una vez confirmada no podrás editar la orden.',
			onAccept: async () => {
				await successRequest(formValues);
			}
		});
	}

	function handleClose() {
		onClose();
		formHandler.reset({ userId: '' });
	}

	return (
		<FormDialog
			open={open}
			onClose={handleClose}
			title="Asignar orden"
			subtitle="Elige al fumigador que realizará el servicio."
			onSubmit={formHandler.handleSubmit(onSubmit)}
			submitLabel="Asignar"
		>
			<Stack spacing={2}>
				<TextFieldForm
					control={formHandler.control}
					name="userId"
					label="Fumigador"
					size="small"
					disabled={isLoading}
					select
					fullWidth
				>
					{fumigators.map((fumigator) => (
						<MenuItem
							key={fumigator.userId}
							value={fumigator.userId}
							disabled={fumigator.disabled}
						>
							{fumigator.disabled ? `${fumigator.name} (falta configurar firma)` : fumigator.name}
						</MenuItem>
					))}
				</TextFieldForm>
				<Typography
					variant="caption"
					color="text.secondary"
				>
					Solo aparecen usuarios con rol de fumigador. Si falta alguno, revisa que tenga su firma configurada.
				</Typography>
			</Stack>
		</FormDialog>
	);
}

export default AssignOrderDialog;
