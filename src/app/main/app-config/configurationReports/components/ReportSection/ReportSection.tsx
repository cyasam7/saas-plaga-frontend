import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface IReportSectionProps {
	title: string;
	color: string;
	titleFontSize?: number;
	children: ReactNode;
}

/** Caja gris con título de color: el bloque de sección que se repite en Certificado y Orden de servicio. */
function ReportSection({ title, color, titleFontSize = 14, children }: IReportSectionProps) {
	return (
		<Box sx={{ backgroundColor: '#f8fafc', borderRadius: '6px', p: '15px' }}>
			<Typography sx={{ fontSize: titleFontSize, fontWeight: 700, color, mb: '10px' }}>{title}</Typography>
			{children}
		</Box>
	);
}

export default ReportSection;
