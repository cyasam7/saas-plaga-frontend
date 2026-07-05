import { Button, Dialog, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import { displayToast } from '@fuse/core/FuseMessage/DisplayToast';
import { yupResolver } from '@hookform/resolvers/yup';
import { DateTimePickerField } from 'app/shared-components/DateTimePicker';
import TextFieldForm from 'app/shared-components/Form/TextFieldForm/TextFieldForm';
import { IOrderFollowUpDialogProps } from './IOrderFollowUpDialogProps';
import { IFollowUpForm, followUppSchema } from './schema';
import { OrderService } from '../../../../shared/services/OrderService';

function OrderFollowUpDialog(props: IOrderFollowUpDialogProps) {
	const { open, onClose, onSubmit, id } = props;

	const formHandler = useForm<IFollowUpForm>({
		resolver: yupResolver(followUppSchema),
		defaultValues: {
			date: null,
			description: ''
		}
	});

	async function handleSubmit(formValues: IFollowUpForm): Promise<void> {
		try {
			await OrderService.createFollowingOrder({
				id,
				date: formValues.date.utc().toDate(),
				description: formValues.description
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
		formHandler.reset({ date: null, description: '' });
	}

	return (
		<Dialog
			open={open}
			maxWidth="sm"
			fullWidth
		>
			<DialogTitle>
				<Stack
					direction="row"
					justifyContent="space-between"
					alignItems="center"
				>
					<Typography variant="h6">Order de seguimiento</Typography>
					<Stack
						direction="row"
						spacing={2}
					>
						<Button
							variant="outlined"
							color="primary"
							onClick={handleOnClose}
							disabled={formHandler.formState.isSubmitting}
						>
							Cancelar
						</Button>
						<Button
							variant="contained"
							color="primary"
							onClick={formHandler.handleSubmit(handleSubmit)}
							disabled={formHandler.formState.isSubmitting}
						>
							Guardar
						</Button>
					</Stack>
				</Stack>
			</DialogTitle>
			<DialogContent>
				<Stack
					py={2}
					spacing={2}
				>
					<DateTimePickerField
						control={formHandler.control}
						name="date"
						disabled={formHandler.formState.isSubmitting}
					/>
					<TextFieldForm
						control={formHandler.control}
						name="description"
						label="Descripción"
						placeholder="Escribe una breve descripción de la orden"
						disabled={formHandler.formState.isSubmitting}
						required
						fullWidth
						multiline
						rows={5}
					/>
				</Stack>
			</DialogContent>
		</Dialog>
	);
}

export default OrderFollowUpDialog;
