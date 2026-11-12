import { EStatusOrder } from 'src/app/requests/orders/types';

/**
 * Filtros que se resuelven en el cliente sobre la lista que ya devolvió GET /order/datagrid.
 * El día (tabs) y el fumigador viven en la URL y los resuelve el API (`useOrdersFilters`).
 */
export interface OrdersAdminFilters {
	search: string;
	/** `YYYY-MM-DD`; cadena vacía = sin límite. */
	dateFrom: string;
	/** `YYYY-MM-DD`; cadena vacía = sin límite. */
	dateTo: string;
	/** Cadena vacía = todos los estatus. */
	status: EStatusOrder | '';
	/** Nombre del cliente; cadena vacía = todos. */
	clientName: string;
}
