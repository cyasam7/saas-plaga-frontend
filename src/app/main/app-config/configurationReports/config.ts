import * as yup from 'yup';
import { FIELD_REQUIRED } from 'src/app/shared-constants/yupMessages';
import { IFormSaveAccount } from 'src/app/shared/entities/AppConfig';
import { ComponentType } from 'react';
import CertificatePreview from './components/CertificatePreview/CertificatePreview';
import ServiceOrderPreview from './components/ServiceOrderPreview/ServiceOrderPreview';
import { IReportPreviewProps, ReportType } from './entities/ReportPreview';

const INVALID_COLOR = 'Usa un color en formato #RRGGBB';

/** El backend todavía no valida el archivo: esto es sólo feedback, no una garantía. */
export const MAX_LOGO_BYTES = 2 * 1024 * 1024;
export const ACCEPTED_LOGO_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];

export const accountSchema = yup.object().shape({
	name: yup.string().required(FIELD_REQUIRED),
	address: yup.string().required(FIELD_REQUIRED),
	logo: yup.mixed().nullable(),
	primaryColor: yup.string().required(FIELD_REQUIRED).matches(/^#[0-9a-fA-F]{6}$/, INVALID_COLOR),
	secondaryColor: yup.string().required(FIELD_REQUIRED).matches(/^#[0-9a-fA-F]{6}$/, INVALID_COLOR),
	licenseSanitary: yup.string().required(FIELD_REQUIRED)
});

export const defaultValuesAccountUser: IFormSaveAccount = {
	address: '',
	logo: null,
	name: '',
	primaryColor: '#000000',
	secondaryColor: '#000000',
	licenseSanitary: ''
};

export function validateLogo(file: File): string | null {
	if (!ACCEPTED_LOGO_TYPES.includes(file.type)) {
		return 'Formato no válido. Usa PNG, JPG, WEBP o SVG.';
	}

	if (file.size > MAX_LOGO_BYTES) {
		return 'La imagen supera el tamaño máximo de 2MB.';
	}

	return null;
}

export const PREVIEW_BY_REPORT_TYPE: Record<ReportType, ComponentType<IReportPreviewProps>> = {
	certificate: CertificatePreview,
	serviceOrder: ServiceOrderPreview
};
