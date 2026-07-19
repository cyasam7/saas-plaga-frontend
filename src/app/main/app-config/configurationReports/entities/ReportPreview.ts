export type ReportType = 'certificate' | 'serviceOrder';

/** Los campos que la configuración de la cuenta controla en cualquier reporte. */
export interface IReportPreviewProps {
	name: string;
	address: string;
	licenseSanitary: string;
	primaryColor: string;
	secondaryColor: string;
	logoUrl?: string;
}

export const REPORT_TYPE_OPTIONS: { value: ReportType; label: string }[] = [
	{ value: 'certificate', label: 'Certificado' },
	{ value: 'serviceOrder', label: 'Orden de servicio' }
];
