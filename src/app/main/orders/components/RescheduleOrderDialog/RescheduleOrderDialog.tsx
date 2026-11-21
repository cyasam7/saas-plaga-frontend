import React, { useEffect } from 'react';
import { Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQueryClient } from 'react-query';
import dayjs from 'dayjs';
import FormDialog from 'app/shared/components/FormDialog/FormDialog';
import { DateTimePickerField } from 'app/shared/components/DateTimePicker';
import { displayToast } from 'app/core/feedback/toast';
import { useMutationRescheduleOrder } from 'src/app/requests/orders/useMutationRescheduleOrder';
import { orderKeys } from 'src/app/requests/orders/keys';
import { DATE_TIME_FORMAT } from 'src/app/shared/constants/dateFormat';
import { IRescheduleOrderForm, rescheduleOrderSchema } from './schema';

interface RescheduleOrderDialogProps {
	open: boolean;
	orderId: string;
	/** Fecha actual de la orden (ISO), para mostrarla y usarla de punto de partida. */
	currentOrderDate: string | null;
	onClose: () => void;
}

function RescheduleOrderDialog({ open, orderId, currentOrderDate, onClose }: RescheduleOrderDialogProps) {
	const queryClient = useQueryClient();
	const { mutateAsync: rescheduleOrder, isLoading: isRescheduling } = useMutationRescheduleOrder();

	const formHandler = useForm<IRescheduleOrderForm>({
		resolver: yupResolver(rescheduleOrderSchema),
		defaultValues: { date: null }
	});

	// Se parte de la fecha actual si sigue en el futuro; una orden vencida empieza vacía.
	useEffect(() => {
		if (!open) return;
		const currentDate = currentOrderDate ? dayjs(currentOrderDate) : null;
		formHandler.reset({ date: currentDate && currentDate.isAfter(dayjs()) ? currentDate : null });
	}, [open, currentOrderDate]);

	async function handleReschedule({ date }: IRescheduleOrderForm): Promise<void> {
		try {
			await rescheduleOrder({ orderId, date: date.utc().toISOString() });
			displayToast({
				anchorOrigin: { horizontal: 'right', vertical: 'top' },
				autoHideDuration: 4000,
				message: 'Se cambió la fecha de la orden',
				variant: 'success'
			});
			await queryClient.invalidateQueries(orderKeys.all);
			onClose();
		} catch {
			// El fetcher ya muestra el motivo que manda el API (p. ej. que choca con su seguimiento).
		}
	}

	return (
		<FormDialog
			open={open}
			onClose={onClose}
			title="Cambiar fecha de la orden"
			subtitle={currentOrderDate ? `Fecha actual: ${dayjs(currentOrderDate).format(DATE_TIME_FORMAT)}` : undefined}
			onSubmit={formHandler.handleSubmit(handleReschedule)}
			submitLabel="Cambiar fecha"
			isSubmitting={isRescheduling}
		>
			<Stack spacing={2}>
				<DateTimePickerField
					control={formHandler.control}
					name="date"
					label="Nueva fecha"
					disabled={isRescheduling}
				/>
				<Typography
					variant="caption"
					color="text.secondary"
				>
					Si la orden no se realizó, vuelve a quedar pendiente con la nueva fecha.
				</Typography>
			</Stack>
		</FormDialog>
	);
}

export default RescheduleOrderDialog;
