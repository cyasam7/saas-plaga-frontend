import { EStatusOrder } from 'src/app/requests/orders/types';

// Mismas etiquetas que api/src/shared/utils/translateOrderStatus.ts (sin paquete compartido entre apps).
export const statusLabel: Record<EStatusOrder, string> = {
	[EStatusOrder.CREATED]: 'Creada',
	[EStatusOrder.ASSIGNED]: 'Asignada',
	[EStatusOrder.IN_PROGRESS]: 'En progreso',
	[EStatusOrder.PASSED]: 'No visitada',
	[EStatusOrder.DONE]: 'Hecha',
	[EStatusOrder.FINISHED]: 'Terminada',
	[EStatusOrder.CANCELLED]: 'Cancelada'
};

type StatusTone = 'neutral' | 'info' | 'warning' | 'danger' | 'success' | 'muted';

/** Un tono por significado; el mismo mapeo que `STATUS_TONE` de la app móvil. */
export const statusTone: Record<EStatusOrder, StatusTone> = {
	[EStatusOrder.CREATED]: 'neutral',
	[EStatusOrder.ASSIGNED]: 'info',
	[EStatusOrder.IN_PROGRESS]: 'warning',
	[EStatusOrder.PASSED]: 'danger',
	[EStatusOrder.DONE]: 'success',
	[EStatusOrder.FINISHED]: 'success',
	[EStatusOrder.CANCELLED]: 'muted'
};

/** Colores del design system por tono (`statusColors` en mobile-app/src/design-system/tokens.ts). */
export const statusToneColors: Record<StatusTone, { background: string; text: string; dot: string; border?: string }> = {
	neutral: { background: '#eef1ee', text: '#5f6b63', dot: '#a3ada6' },
	info: { background: '#e3eff8', text: '#1f5c8a', dot: '#4a90c9' },
	warning: { background: '#fdf1d8', text: '#b9791a', dot: '#f2b134' },
	danger: { background: '#fbe4e0', text: '#a3312a', dot: '#e2543a' },
	success: { background: '#d3f4e2', text: '#134a38', dot: '#2f8862' },
	// Cancelada: contorno sin relleno, para distinguirla del gris relleno de "Creada".
	muted: { background: '#ffffff', text: '#7c8880', dot: '#c6ccc6', border: '#c6ccc6' }
};

const finalStatus = [EStatusOrder.DONE, EStatusOrder.FINISHED];
export function validateIfOrderIsPending(value: EStatusOrder): boolean {
	return !finalStatus.includes(value);
}

export function translateOrderStatus(value: string): string {
	return statusLabel[value as keyof typeof statusLabel];
}

/** Descarga un PDF recibido del API (certificado u orden de servicio) con el nombre dado. */
export function downloadPdfFile(pdfBlob: Blob, fileName: string): void {
	const pdfUrl = window.URL.createObjectURL(pdfBlob);
	const downloadLink = document.createElement('a');
	downloadLink.href = pdfUrl;
	downloadLink.download = fileName;
	document.body.appendChild(downloadLink);
	downloadLink.click();
	downloadLink.remove();
	window.URL.revokeObjectURL(pdfUrl);
}
