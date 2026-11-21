import { useCallback, useMemo } from 'react';

import useDebounce from 'src/app/shared/hooks/useDebounce';
import useFilterParams from 'src/app/shared/hooks/useFilterParams';
import useTabParam from 'src/app/shared/hooks/useTabParam';

import { EOrdersDayFilter, EStatusOrder } from 'src/app/requests/orders/types';
import { IOrdersDatagridPayload } from 'src/app/requests/orders/useQueryOrdersDatagrid';

const SEARCH_DEBOUNCE_MS = 400;

/** Pestañas de día; la primera (ALL) es la de por defecto. */
const DAY_FILTER_TABS = Object.values(EOrdersDayFilter);
const ORDER_FILTER_KEYS = ['fumigatorId', 'search', 'status', 'clientId'] as const;

export interface OrdersFilters {
	dayFilter: EOrdersDayFilter;
	/** Cadena vacía = todos los fumigadores. */
	fumigatorId: string;
	/** Valor inmediato del input; al API se manda con debounce. */
	search: string;
	/** Cadena vacía = todos los estatus. */
	status: EStatusOrder | '';
	/** Cadena vacía = todos los clientes. */
	clientId: string;
}

interface IUseOrdersFilters {
	filters: OrdersFilters;
	/** Lo que se manda al API: se omiten los valores neutros. */
	query: IOrdersDatagridPayload;
	setFilter: <K extends keyof OrdersFilters>(key: K, value: OrdersFilters[K]) => void;
	/** Limpia búsqueda, estatus, fumigador y cliente; conserva la pestaña de día. */
	clearFilters: () => void;
}

function parseStatus(value: string): EStatusOrder | '' {
	return Object.values(EStatusOrder).includes(value as EStatusOrder) ? (value as EStatusOrder) : '';
}

/**
 * Los filtros viven en los query params: la vista es enlazable, sobrevive el refresh
 * y el back/forward navega entre estados de filtro.
 */
export function useOrdersFilters(): IUseOrdersFilters {
	const [dayFilter, setDayFilter] = useTabParam(DAY_FILTER_TABS);
	const { filters: filterParams, setFilters, clearFilters } = useFilterParams(ORDER_FILTER_KEYS);

	const filters = useMemo<OrdersFilters>(
		() => ({ ...filterParams, dayFilter, status: parseStatus(filterParams.status) }),
		[filterParams, dayFilter]
	);

	const setFilter = useCallback<IUseOrdersFilters['setFilter']>(
		(key, value) => {
			if (key === 'dayFilter') setDayFilter(value as EOrdersDayFilter);
			else setFilters({ [key]: value });
		},
		[setDayFilter, setFilters]
	);

	// La búsqueda espera a que se deje de escribir para no pedir al API en cada tecla.
	const { debounceValue: debouncedSearch } = useDebounce(filters.search, SEARCH_DEBOUNCE_MS);
	const search = (debouncedSearch ?? filters.search).trim();

	const query = useMemo<IOrdersDatagridPayload>(
		() => ({
			dayFilter: filters.dayFilter,
			...(filters.fumigatorId ? { fumigatorId: filters.fumigatorId } : {}),
			...(search ? { search } : {}),
			...(filters.status ? { status: filters.status } : {}),
			...(filters.clientId ? { clientId: filters.clientId } : {})
		}),
		[filters.dayFilter, filters.fumigatorId, filters.status, filters.clientId, search]
	);

	return { filters, query, setFilter, clearFilters };
}

export default useOrdersFilters;
