import { EStatusOrder } from 'src/app/shared/entities/OrderEntity';

export const statusLabel = {
	CREATED: 'Creada',
	ASSIGNED: 'Asignada',
	IN_PROGRESS: 'En progreso',
	PASSED: 'No visitada',
	DONE: 'Hecha',
	FINISHED: 'Terminada'
};

// Mismos valores que api/src/shared/utils/translateOrderStatus.ts (sin paquete compartido entre apps).
export const statusColor: Record<string, string> = {
	CREATED: '#3B82F6',
	ASSIGNED: '#2563EB',
	IN_PROGRESS: '#06B6D4',
	PASSED: '#F97316',
	DONE: '#10B981',
	FINISHED: '#047857'
};

const finalStatus = [EStatusOrder.DONE, EStatusOrder.FINISHED];
export function validateIfOrderIsPending(value: EStatusOrder): boolean {
	return !finalStatus.includes(value);
}

export function translateOrderStatus(value: string): string {
	return statusLabel[value as keyof typeof statusLabel];
}
