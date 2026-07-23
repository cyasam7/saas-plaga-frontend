import { EClientType, EStatusOrder } from 'src/app/shared/entities/OrderEntity';

/** Estatus que componen el historial. Debe coincidir con HISTORY_ORDER_STATUSES del API. */
export const HISTORY_STATUSES: EStatusOrder[] = [
	EStatusOrder.IN_REVIEW,
	EStatusOrder.REVIEWED,
	EStatusOrder.IN_PROGRESS,
	EStatusOrder.DONE,
	EStatusOrder.FINISHED,
	EStatusOrder.CANCELED
];

export const HISTORY_PAGE_SIZE = 20;

export interface OrdersHistoryFilters {
	dateFrom: string | null;
	dateTo: string | null;
	status: EStatusOrder[];
	clientType: EClientType | null;
	search: string;
}

export const EMPTY_FILTERS: OrdersHistoryFilters = {
	dateFrom: null,
	dateTo: null,
	status: [],
	clientType: null,
	search: ''
};

/** Lee los filtros desde los query params de la URL, descartando valores inválidos. */
export function parseFiltersFromParams(params: URLSearchParams): OrdersHistoryFilters {
	const clientType = params.get('clientType');
	const status = (params.get('status') ?? '')
		.split(',')
		.filter((i): i is EStatusOrder => HISTORY_STATUSES.includes(i as EStatusOrder));

	return {
		dateFrom: params.get('dateFrom'),
		dateTo: params.get('dateTo'),
		status,
		clientType: Object.values(EClientType).includes(clientType as EClientType) ? (clientType as EClientType) : null,
		search: params.get('search') ?? ''
	};
}

/** Serializa los filtros a query params, omitiendo los vacíos para no ensuciar la URL. */
export function filtersToParams(filters: OrdersHistoryFilters): URLSearchParams {
	const params = new URLSearchParams();

	if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);

	if (filters.dateTo) params.set('dateTo', filters.dateTo);

	if (filters.status.length) params.set('status', filters.status.join(','));

	if (filters.clientType) params.set('clientType', filters.clientType);

	if (filters.search) params.set('search', filters.search);

	return params;
}

export function hasActiveFilters(filters: OrdersHistoryFilters): boolean {
	return Boolean(
		filters.dateFrom || filters.dateTo || filters.status.length || filters.clientType || filters.search
	);
}
