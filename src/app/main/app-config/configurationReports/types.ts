/** Valores del formulario de configuración de la cuenta (el logo es el archivo elegido, aún sin subir). */
export interface IFormSaveAccount {
	name: string;
	address: string;
	logo: Blob | null;
	primaryColor: string;
	secondaryColor: string;
	licenseSanitary: string;
}

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
