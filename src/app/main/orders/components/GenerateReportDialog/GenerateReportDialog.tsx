import React, { useEffect } from 'react';
import { Button, Dialog, DialogContent, DialogTitle, MenuItem, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { displayToast } from '@fuse/core/FuseMessage/DisplayToast';
import { yupResolver } from '@hookform/resolvers/yup';
import { IOrderFollowUpDialogProps } from './IGenerateReportDialog';
import { IGenerateReportForm, generateReportSchema, TypeReport } from './schema';
import { OrderService } from '../../../../shared/services/OrderService';
import TextFieldForm from 'app/shared-components/Form/TextFieldForm/TextFieldForm';

const mapTranslate = {
	[TypeReport.SERVICE_ORDER]: "Orden de servicio",
	[TypeReport.CERTIFICATE]: "Certificado",
}

function GenerateReportDialog(props: IOrderFollowUpDialogProps) {
	const { open, onClose, onSubmit } = props;

	const formHandler = useForm<IGenerateReportForm>({
		resolver: yupResolver(generateReportSchema),
		defaultValues: {
			days: null,
			typeReport: TypeReport.SERVICE_ORDER
		}
	});

	const { isSubmitting } = formHandler.formState

	async function handleSubmit(data: IGenerateReportForm): Promise<void> {


		if (data.typeReport === TypeReport.CERTIFICATE && !data.days) {
			formHandler.setError("days", { message: "Campo requerido" })
			return;
		}

		try {
			if (data.typeReport === TypeReport.CERTIFICATE) {
				await OrderService.downloadCertificate({
					daysValid: data.days,
					id: props.id
				});
			} else if (data.typeReport === TypeReport.SERVICE_ORDER) {
				await OrderService.downloadServicesOrder(props.id);
			}
			await onSubmit?.();
			displayToast({
				anchorOrigin: { horizontal: 'right', vertical: 'top' },
				autoHideDuration: 1000,
				message: 'Se creo orden correctamente',
				variant: 'success'
			});
		} catch (error) {
			console.log(error)
			displayToast({
				anchorOrigin: { horizontal: 'right', vertical: 'top' },
				autoHideDuration: 1000,
				message: 'Hubo un error al descargar reporte',
				variant: 'error'
			})
		}
	}

	function handleOnClose(): void {
		onClose();
		formHandler.reset({ days: null, typeReport: TypeReport.SERVICE_ORDER });
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
							disabled={isSubmitting}
						>
							Cerrar
						</Button>
						<Button
							variant="contained"
							color="primary"
							disabled={isSubmitting}
							onClick={formHandler.handleSubmit(handleSubmit)}
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
					<TextFieldForm
						control={formHandler.control}
						label={"Tipo de reporte"}
						name='typeReport'
						select
					>
						{Object.values(TypeReport).map(i =>
							<MenuItem key={i} value={i}>
								{mapTranslate[i]}
							</MenuItem>)
						}
					</TextFieldForm>
					{formHandler.watch("typeReport") === TypeReport.CERTIFICATE && (
						<TextFieldForm
							type='number'
							control={formHandler.control}
							label={"Dias de valides del reporte"}
							name='days'
						/>
					)}
				</Stack>
			</DialogContent>
		</Dialog>
	);
}

export default GenerateReportDialog;
