import { ReportType } from './types';

export const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;

export const REPORT_TYPE_OPTIONS: { value: ReportType; label: string }[] = [
	{ value: 'certificate', label: 'Certificado' },
	{ value: 'serviceOrder', label: 'Orden de servicio' }
];

/** Mientras se escribe el hex a mano el valor pasa por estados inválidos que romperían el render. */
export function safeColor(value: string): string {
	return HEX_PATTERN.test(value) ? value : '#000000';
}
