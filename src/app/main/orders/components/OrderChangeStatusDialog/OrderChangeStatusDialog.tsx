import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	FormLabel,
	MenuItem,
	Stack,
	Typography
} from '@mui/material';
import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { displayToast } from '@fuse/core/FuseMessage/DisplayToast';
import { openDialog } from 'app/shared-components/GlobalDialog/openDialog';
import TextFieldForm from 'app/shared-components/Form/TextFieldForm/TextFieldForm';
import { EStatusOrder } from '../../../../shared/entities/OrderEntity';
import { OrderService } from '../../../../shared/services/OrderService';
import { IOrderChangeStatusDialogProps, IStatusForm } from './IOrderChangeStatusDialogProps';
import { translateOrderStatus } from '../../utils';

function OrderChangeStatusDialog(props: IOrderChangeStatusDialogProps) {
	const { open, id, onClose } = props;
	const queryClient = useQueryClient();

	const formHandler = useForm<IStatusForm>({
		defaultValues: {
			status: ''
		}
	});

	const { data: order } = useQuery({
		queryKey: ['get-order-status-by-id', id],
		queryFn: () => OrderService.getById(id),
		enabled: Boolean(id)
	});
	useEffect(() => {
		if (order) {
			formHandler.reset({ status: order.status });
		}
		return () => {
			formHandler.reset({ status: '' });
		};
	}, [order]);

	async function successRequest(data: IStatusForm): Promise<void> {
		await OrderService.updateStatus(id, data.status as EStatusOrder);
		displayToast({
			anchorOrigin: {
				horizontal: 'right',
				vertical: 'top'
			},
			autoHideDuration: 4000,
			message: 'Se a actualizado correctamente',
			variant: 'success'
		});
		handleClose();
		await queryClient.invalidateQueries('orders');
	}

	async function onSubmit(data: IStatusForm): Promise<void> {
		openDialog({
			title: 'Confirmación requerida',
			text: '¿Estas seguro que deseas confirmar orden?, una vez confirmada no podrás editar la orden.',
			onAccept: async () => {
				await successRequest(data);
			}
		});
	}

	function handleClose(): void {
		onClose();
	}

	const options = Object.values(EStatusOrder);

	return (
		<Dialog
			open={open}
			fullWidth
			maxWidth="sm"
		>
			<DialogTitle>
				<Typography variant="h6">Estatus de orden</Typography>
			</DialogTitle>
			<DialogContent>
				<Stack className="w-full">
					<FormControl>
						<FormLabel>Selecciona el estatus a actualizar</FormLabel>
						<TextFieldForm
							control={formHandler.control}
							name="status"
							label=""
							className="pt-8"
							select
							fullWidth
						>
							{options.map((i) => (
								<MenuItem
									key={i}
									value={i}
								>
									{translateOrderStatus(i)}
								</MenuItem>
							))}
						</TextFieldForm>
					</FormControl>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button
					color="primary"
					variant="outlined"
					onClick={handleClose}
				>
					Cancelar
				</Button>
				<Button
					color="primary"
					variant="contained"
					onClick={formHandler.handleSubmit(onSubmit)}
				>
					Guardar
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default OrderChangeStatusDialog;
