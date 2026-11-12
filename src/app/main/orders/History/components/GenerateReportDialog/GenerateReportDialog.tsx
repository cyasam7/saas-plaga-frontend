import React from 'react';
import { Button, Dialog, DialogContent, DialogTitle, MenuItem, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { displayToast } from 'app/core/feedback/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import TextFieldForm from 'app/shared/components/Form/TextFieldForm/TextFieldForm';
import { useMutationDownloadOrderCertificate } from 'src/app/requests/orders/useMutationDownloadOrderCertificate';
import { useMutationDownloadFumigationReport } from 'src/app/requests/orders/useMutationDownloadFumigationReport';
import { downloadPdfFile } from '../../../utils';
import { IGenerateReportDialogProps } from './IGenerateReportDialog';
import { IGenerateReportForm, generateReportSchema, TypeReport } from './schema';

const DAYS_PER_MONTH = 30;

const mapTranslate = {
	[TypeReport.SERVICE_ORDER]: 'Orden de servicio',
	[TypeReport.CERTIFICATE]: 'Certificado'
};

function GenerateReportDialog(props: IGenerateReportDialogProps) {
	const { open, onClose, onSubmit } = props;

	const { mutateAsync: downloadOrderCertificate } = useMutationDownloadOrderCertificate();
	const { mutateAsync: downloadFumigationReport } = useMutationDownloadFumigationReport();

	const formHandler = useForm<IGenerateReportForm>({
		resolver: yupResolver(generateReportSchema),
		defaultValues: {
			months: null,
			typeReport: TypeReport.SERVICE_ORDER
		}
	});

	const { isSubmitting } = formHandler.formState;

	async function handleSubmit(data: IGenerateReportForm): Promise<void> {
		if (data.typeReport === TypeReport.CERTIFICATE && !data.months) {
			formHandler.setError('months', { message: 'Campo requerido' });
			return;
		}

		try {
			if (data.typeReport === TypeReport.CERTIFICATE) {
				const certificatePdf = await downloadOrderCertificate({ orderId: props.id, daysValid: data.months * DAYS_PER_MONTH });
				downloadPdfFile(certificatePdf, `${props.id}.pdf`);
			} else if (data.typeReport === TypeReport.SERVICE_ORDER) {
				const fumigationReportPdf = await downloadFumigationReport({ orderId: props.id });
				downloadPdfFile(fumigationReportPdf, `${props.id}.pdf`);
			}

			await onSubmit?.();
			displayToast({
				anchorOrigin: { horizontal: 'right', vertical: 'top' },
				autoHideDuration: 1000,
				message: 'Reporte generado correctamente',
				variant: 'success'
			});
		} catch (error) {
			console.log(error);
			displayToast({
				anchorOrigin: { horizontal: 'right', vertical: 'top' },
				autoHideDuration: 1000,
				message: 'Hubo un error al descargar reporte',
				variant: 'error'
			});
		}
	}

	function handleOnClose(): void {
		onClose();
		formHandler.reset({ months: null, typeReport: TypeReport.SERVICE_ORDER });
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
					<Typography variant="h6">Generar reporte</Typography>
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
							Descargar
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
						label="Tipo de reporte"
						name="typeReport"
						select
					>
						{Object.values(TypeReport).map((i) => (
							<MenuItem
								key={i}
								value={i}
							>
								{mapTranslate[i]}
							</MenuItem>
						))}
					</TextFieldForm>
					{formHandler.watch('typeReport') === TypeReport.CERTIFICATE && (
						<TextFieldForm
							type="number"
							control={formHandler.control}
							label="Meses de validez del certificado"
							name="months"
						/>
					)}
				</Stack>
			</DialogContent>
		</Dialog>
	);
}

export default GenerateReportDialog;
