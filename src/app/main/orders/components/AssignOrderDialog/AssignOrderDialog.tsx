import React from 'react';
import { FormControl, FormLabel, MenuItem, Stack, Typography } from '@mui/material';
import TextFieldForm from 'app/shared-components/Form/TextFieldForm/TextFieldForm';
import HeaderDialog from 'app/shared-components/DialogSkeleton/HeaderDialog/HeaderDialog';
import DialogSkeleton from 'app/shared-components/DialogSkeleton/DialogSkeleton';
import { useForm } from 'react-hook-form';
import { openDialog } from 'app/shared-components/GlobalDialog/openDialog';
import { useQuery, useQueryClient } from 'react-query';
import { OrderService } from 'src/app/shared/services/OrderService';
import { displayToast } from '@fuse/core/FuseMessage/DisplayToast';
import { IAssignOrderDialog, IAssignOrderForm } from './IAssignOrderDialog';

function AssignOrderDialog(props: IAssignOrderDialog) {
	const { onClose, open, orderId } = props;
	const queryClient = useQueryClient();

	const { data: fumigators = [], isLoading } = useQuery({
		queryFn: () => OrderService.getFumigatorToAssignOrder(),
		queryKey: 'users-assign'
	});

	const formHandler = useForm<IAssignOrderForm>({
		defaultValues: {
			userId: ''
		}
	});

	async function successRequest({ userId }: IAssignOrderForm): Promise<void> {
		try {
			await OrderService.updateOrderAssigned({
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
			await queryClient.invalidateQueries('orders');
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
		<DialogSkeleton
			open={open}
			header={
				<HeaderDialog
					title="Asignar orden de servicio"
					onClickSecondaryButton={handleClose}
					onClickPrimaryButton={formHandler.handleSubmit(onSubmit)}
				/>
			}
			content={
				<Stack spacing={2}>
					<FormControl>
						<FormLabel>Selecciona el trabajador para esta orden</FormLabel>
						{!isLoading && (
							<TextFieldForm
								control={formHandler.control}
								name="userId"
								label=""
								className="pt-8"
								select
								fullWidth
							>
								{fumigators.map((i) => (
									<MenuItem
										key={i.userId}
										value={i.userId}
										disabled={i.disabled}
									>
										{`${i.name}  ${i.disabled ? '(Falta configurar firma)' : ''}`}
									</MenuItem>
								))}
							</TextFieldForm>
						)}
					</FormControl>
					<Typography variant="body2" color="text.secondary">
						Nota: Aquí aparecerán todos los trabajadores que tienen el rol de fumigador, si no aparece el trabajador que buscas, verifica que tenga configurada su firma.
					</Typography>
				</Stack>
			}
			maxWidth="sm"
		/>
	);
}

export default AssignOrderDialog;
