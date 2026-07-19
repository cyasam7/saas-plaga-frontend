import {
	Chip,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Stack,
	ToggleButton,
	ToggleButtonGroup,
	Typography
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { MouseEvent } from 'react';
import { IReportPreviewProps, REPORT_TYPE_OPTIONS, ReportType } from '../../entities/ReportPreview';
import { PREVIEW_BY_REPORT_TYPE } from '../../config';

interface ReportPreviewDialogProps {
	open: boolean;
	onClose: () => void;
	reportType: ReportType;
	onChangeReportType: (e: MouseEvent<HTMLElement>, value: ReportType | null) => void;
	previewValues: IReportPreviewProps;
}

function ReportPreviewDialog({
	open,
	onClose,
	reportType,
	onChangeReportType,
	previewValues
}: ReportPreviewDialogProps) {
	const PreviewComponent = PREVIEW_BY_REPORT_TYPE[reportType];

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="md"
			fullWidth
		>
			<DialogTitle
				component="div"
				sx={{ pr: 6 }}
			>
				<Stack
					direction={{ xs: 'column', sm: 'row' }}
					spacing={1.5}
					justifyContent="space-between"
					alignItems={{ xs: 'flex-start', sm: 'center' }}
				>
					<Stack
						direction="row"
						spacing={1}
						alignItems="center"
					>
						<Typography
							variant="subtitle1"
							fontWeight={600}
						>
							Vista previa
						</Typography>
						<Chip
							size="small"
							label="Datos de ejemplo"
							variant="outlined"
						/>
					</Stack>
					<ToggleButtonGroup
						exclusive
						size="small"
						value={reportType}
						aria-label="Tipo de reporte"
						onChange={onChangeReportType}
					>
						{REPORT_TYPE_OPTIONS.map((option) => (
							<ToggleButton
								key={option.value}
								value={option.value}
							>
								{option.label}
							</ToggleButton>
						))}
					</ToggleButtonGroup>
				</Stack>
				<IconButton
					aria-label="Cerrar"
					onClick={onClose}
					sx={{ position: 'absolute', right: 8, top: 8, color: 'text.secondary' }}
				>
					<Close />
				</IconButton>
			</DialogTitle>
			<DialogContent dividers>
				<PreviewComponent {...previewValues} />
			</DialogContent>
		</Dialog>
	);
}

export default ReportPreviewDialog;
