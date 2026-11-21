import { EClientType } from 'src/app/requests/clients/types';
import { EStatusOrder } from 'src/app/requests/orders/types';

/** Estatus que componen el historial. Debe coincidir con HISTORY_ORDER_STATUSES del API. */
export const HISTORY_STATUSES: EStatusOrder[] = [
	EStatusOrder.IN_PROGRESS,
	EStatusOrder.DONE,
	EStatusOrder.FINISHED,
	EStatusOrder.CANCELLED
];

export const HISTORY_PAGE_SIZE = 20;

export interface OrdersHistoryFilters {
	dateFrom: string | null;
	dateTo: string | null;
	status: EStatusOrder[];
	clientType: EClientType | null;
	/** Cadena vacía = todos los fumigadores. */
	fumigatorId: string;
	search: string;
}
