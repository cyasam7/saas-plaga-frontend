import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Stack,
	Typography
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { displayToast } from '@fuse/core/FuseMessage/DisplayToast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from 'react-query';
import dayjs from 'dayjs';
import { openDialog } from 'app/shared-components/GlobalDialog/openDialog';
import { LoadingButton } from '@mui/lab';
import FormOrder from '../FormOrder/FormOrder';
import { EBusinessMode, EClientType, IFormCreatePest } from '../FormOrder/FormOrderProps';
import { OrderDialogProps } from './OrderDialogProps';
import { OrderService } from '../../../../shared/services/OrderService';
import { createOrderSchema } from '../FormOrder/schema';
import { defaultValuesOrder } from '../FormOrder/defaultValues';
import { Transition } from './transition';

function OrderDialog(props: OrderDialogProps) {
	const { onCancel, onSubmit, open, id, shouldOpenDialogAssign } = props;

	const isUpdating = Boolean(id);

	const formHandler = useForm<IFormCreatePest>({
		resolver: yupResolver<IFormCreatePest>(createOrderSchema as any),
		defaultValues: defaultValuesOrder
	});

	const { data } = useQuery({
		queryKey: ['order-by-id', id],
		queryFn: () => OrderService.getById(id),
		enabled: Boolean(id) && open
	});

	useEffect(() => {
		if (data) {
			formHandler.reset({
				clientId: data.clientId ?? "",
				clientAddress: data.clientAddress,
				clientName: data.clientName,
				clientPhone: data.clientPhone,
				clientType: data.clientType ?? EClientType.INDIVIDUAL,
				businessMode: EBusinessMode.EXISTING,
				price: String(data.price),
				date: dayjs(data.date)
			});
		}
		return () => {
			formHandler.reset(defaultValuesOrder);
		};
	}, [data]);

	async function handleSubmit(formValues: IFormCreatePest): Promise<void> {
		try {
			const base = {
				clientId: formValues.clientId || undefined,
				clientName: formValues.clientName,
				clientPhone: formValues.clientPhone,
				clientAddress: formValues.clientAddress,
				description: formValues.description,
				date: formValues.date.utc().toISOString(),
				price: formValues.price
			};

			let orderIdSaved: { id: string };
			if (isUpdating) {
				orderIdSaved = await OrderService.updateOrder({
					...base,
					id,
					clientType: formValues.clientType,
					isFollowUp: false
				});
			} else if (formValues.clientType === EClientType.BUSINESS) {
				orderIdSaved = await OrderService.createBusinessOrder(base);
			} else {
				orderIdSaved = await OrderService.createIndividualOrder(base);
			}

			handleResetForm();
			displayToast({
				message: 'Se ha guardado correctamente',
				autoHideDuration: 4000,
				variant: 'success',
				anchorOrigin: {
					horizontal: 'right',
					vertical: 'top'
				}
			});
			await onSubmit?.(orderIdSaved.id, shouldOpenDialogAssign);
		} catch (error) {
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

	function handleCancel(): void {
		if (isUpdating && formHandler.formState.isDirty) {
			openDialog({
				title: 'Confirmación requerida',
				text: '¿Seguro que deseas cancelar sin guardar?',
				onAccept() {
					handleResetForm();
				}
			});
		} else {
			handleResetForm();
		}
	}

	function handleResetForm(): void {
		formHandler.reset(defaultValuesOrder);
		onCancel();
	}

	const isSubmitting = formHandler.formState.isSubmitting;

	return (
		<Dialog
			open={open}
			TransitionComponent={Transition}
			maxWidth="md"
			fullWidth
			PaperProps={{ sx: { borderRadius: 3 } }}
		>
			<DialogTitle sx={{ pb: 1.5 }}>
				<Stack
					direction="row"
					justifyContent="space-between"
					alignItems="flex-start"
					spacing={2}
				>
					<Box>
						<Typography
							variant="h6"
							sx={{ fontWeight: 700, lineHeight: 1.3 }}
						>
							{isUpdating ? 'Editar orden' : 'Nueva orden'}
						</Typography>
						<Typography
							variant="body2"
							color="text.secondary"
						>
							{isUpdating
								? 'Actualiza los datos de la orden de servicio.'
								: 'Registra el cliente y los detalles del servicio.'}
						</Typography>
					</Box>
					<IconButton
						aria-label="Cerrar"
						onClick={handleCancel}
						disabled={isSubmitting}
						sx={{ mt: -0.5, mr: -0.5 }}
					>
						<Close />
					</IconButton>
				</Stack>
			</DialogTitle>
			<DialogContent dividers>
				<FormOrder
					formHandler={formHandler}
					disabled={isSubmitting}
					isUpdating={isUpdating}
					disableSpecificField={
						isUpdating && {
							clientAddressField: true,
							clientNameField: true,
							clientPhoneField: true,
							clientTypeField: true
						}
					}
				/>
			</DialogContent>
			<DialogActions sx={{ px: 3, py: 2 }}>
				<Button
					color="primary"
					variant="outlined"
					disabled={isSubmitting}
					onClick={handleCancel}
				>
					Cancelar
				</Button>
				<LoadingButton
					color="primary"
					variant="contained"
					loading={isSubmitting}
					onClick={formHandler.handleSubmit(handleSubmit)}
				>
					{isUpdating ? 'Guardar cambios' : 'Crear orden'}
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
}

export default OrderDialog;
