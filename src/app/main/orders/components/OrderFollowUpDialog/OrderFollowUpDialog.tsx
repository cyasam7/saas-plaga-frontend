import { Stack } from '@mui/material';
import FormDialog from 'app/shared/components/FormDialog/FormDialog';
import React from 'react';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { displayToast } from 'app/core/feedback/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { DateTimePickerField } from 'app/shared/components/DateTimePicker';
import TextFieldForm from 'app/shared/components/Form/TextFieldForm/TextFieldForm';
import { IOrderFollowUpDialogProps } from './IOrderFollowUpDialogProps';
import { IFollowUpForm, followUppSchema } from './schema';
import { useMutationCreateFollowUpOrder } from 'src/app/requests/orders/useMutationCreateFollowUpOrder';
import { DATE_TIME_FORMAT } from 'src/app/shared/constants/dateFormat';

function OrderFollowUpDialog(props: IOrderFollowUpDialogProps) {
	const { open, onClose, onSubmit, id, referenceOrderDate } = props;

	// El seguimiento va después de la orden de referencia (y nunca en el pasado). El API valida lo mismo.
	const referenceOrderDayjs = referenceOrderDate ? dayjs(referenceOrderDate) : null;
	const minimumFollowUpDate =
		referenceOrderDayjs && referenceOrderDayjs.isAfter(dayjs()) ? referenceOrderDayjs : dayjs();

	const formHandler = useForm<IFollowUpForm>({
		resolver: yupResolver(followUppSchema),
		defaultValues: {
			date: null,
			notes: ''
		}
	});

	const { mutateAsync: createFollowUpOrder } = useMutationCreateFollowUpOrder();

	async function handleSubmit(formValues: IFollowUpForm): Promise<void> {
		// El picker bloquea las fechas anteriores, pero una fecha escrita a mano puede saltarse ese límite.
		if (referenceOrderDayjs && !formValues.date.isAfter(referenceOrderDayjs)) {
			displayToast({
				anchorOrigin: { horizontal: 'right', vertical: 'top' },
				autoHideDuration: 2000,
				message: `La fecha del seguimiento debe ser posterior a la de la orden (${referenceOrderDayjs.format(DATE_TIME_FORMAT)})`,
				variant: 'error'
			});
			return;
		}
		try {
			await createFollowUpOrder({
				id,
				date: formValues.date.utc().toISOString(),
				notes: formValues.notes
			});
			displayToast({
				anchorOrigin: { horizontal: 'right', vertical: 'top' },
				autoHideDuration: 1000,
				message: 'Se creo seguimiento correctamente',
				variant: 'success'
			});
			handleOnClose();
			await onSubmit();
		} catch (error) {
			displayToast({
				anchorOrigin: { horizontal: 'right', vertical: 'top' },
				autoHideDuration: 1000,
				message: 'Algo salio mal',
				variant: 'error'
			});
		}
	}

	function handleOnClose(): void {
		onClose();
		formHandler.reset({ date: null, notes: '' });
	}

	return (
		<FormDialog
			open={open}
			onClose={handleOnClose}
			title="Orden de seguimiento"
			subtitle="Programa la siguiente visita para este cliente."
			onSubmit={formHandler.handleSubmit(handleSubmit)}
			submitLabel="Programar seguimiento"
			isSubmitting={formHandler.formState.isSubmitting}
		>
			<Stack spacing={2}>
				<DateTimePickerField
					control={formHandler.control}
					name="date"
					label="Fecha y hora"
					disabled={formHandler.formState.isSubmitting}
					minDateTime={minimumFollowUpDate}
				/>
				<TextFieldForm
					control={formHandler.control}
					name="notes"
					label="Descripción"
					placeholder="Escribe una breve descripción de la orden"
					disabled={formHandler.formState.isSubmitting}
					size="small"
					required
					fullWidth
					multiline
					rows={5}
				/>
			</Stack>
		</FormDialog>
	);
}

export default OrderFollowUpDialog;
