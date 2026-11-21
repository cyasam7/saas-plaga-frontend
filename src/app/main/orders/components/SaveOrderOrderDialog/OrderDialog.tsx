import React from 'react';
import { useForm } from 'react-hook-form';
import { displayToast } from 'app/core/feedback/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import FormOrder from '../FormOrder/FormOrder';
import { EClientType, IFormCreatePest } from '../FormOrder/FormOrderProps';
import { OrderDialogProps } from './OrderDialogProps';
import { ICreateOrderPayload } from 'src/app/requests/orders/types';
import { useMutationCreateIndividualOrder } from 'src/app/requests/orders/useMutationCreateIndividualOrder';
import { useMutationCreateBusinessOrder } from 'src/app/requests/orders/useMutationCreateBusinessOrder';
import { createOrderSchema } from '../FormOrder/schema';
import { defaultValuesOrder } from '../FormOrder/defaultValues';
import FormDialog from 'app/shared/components/FormDialog/FormDialog';

function OrderDialog(props: OrderDialogProps) {
	const { onCancel, onSubmit, open, shouldOpenDialogAssign } = props;

	const formHandler = useForm<IFormCreatePest>({
		resolver: yupResolver<IFormCreatePest>(createOrderSchema as any),
		defaultValues: defaultValuesOrder
	});
	const { mutateAsync: createIndividualOrder } = useMutationCreateIndividualOrder();
	const { mutateAsync: createBusinessOrder } = useMutationCreateBusinessOrder();

	async function handleSubmit(formValues: IFormCreatePest): Promise<void> {
		try {
			const createOrderPayload: ICreateOrderPayload = {
				clientId: formValues.clientId || undefined,
				clientName: formValues.clientName,
				clientPhone: formValues.clientPhone,
				clientAddress: formValues.clientAddress,
				notes: formValues.notes,
				date: formValues.date.utc().toISOString(),
				price: formValues.price
			};

			let orderIdSaved: { id: string };
			if (formValues.clientType === EClientType.BUSINESS) {
				orderIdSaved = await createBusinessOrder(createOrderPayload);
			} else {
				orderIdSaved = await createIndividualOrder(createOrderPayload);
			}

			handleCancel();
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
		formHandler.reset(defaultValuesOrder);
		onCancel();
	}

	const isSubmitting = formHandler.formState.isSubmitting;

	return (
		<FormDialog
			open={open}
			onClose={handleCancel}
			maxWidth="md"
			title="Nueva orden"
			subtitle="Registra el cliente y los detalles del servicio."
			onSubmit={formHandler.handleSubmit(handleSubmit)}
			submitLabel="Crear orden"
			isSubmitting={isSubmitting}
		>
			<FormOrder
				formHandler={formHandler}
				disabled={isSubmitting}
			/>
		</FormDialog>
	);
}

export default OrderDialog;
