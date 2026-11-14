import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import useDebounce from 'src/app/shared/hooks/useDebounce';

import { EOrdersDayFilter, EStatusOrder } from 'src/app/requests/orders/types';
import { IOrdersDatagridPayload } from 'src/app/requests/orders/useQueryOrdersDatagrid';

const DAY_FILTER_PARAM = 'dayFilter';
const FUMIGATOR_PARAM = 'fumigatorId';
const SEARCH_PARAM = 'search';
const STATUS_PARAM = 'status';
const CLIENT_PARAM = 'clientId';
const SEARCH_DEBOUNCE_MS = 400;

const DAY_FILTERS = Object.values(EOrdersDayFilter);

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

function parseDayFilter(value: string | null): EOrdersDayFilter {
	return DAY_FILTERS.includes(value as EOrdersDayFilter) ? (value as EOrdersDayFilter) : EOrdersDayFilter.ALL;
}

function parseStatus(value: string | null): EStatusOrder | '' {
	return Object.values(EStatusOrder).includes(value as EStatusOrder) ? (value as EStatusOrder) : '';
}

/**
 * Los filtros viven en los query params: la vista es enlazable, sobrevive el refresh
 * y el back/forward navega entre estados de filtro.
 */
export function useOrdersFilters(): IUseOrdersFilters {
	const [searchParams, setSearchParams] = useSearchParams();

	const filters = useMemo<OrdersFilters>(
		() => ({
			dayFilter: parseDayFilter(searchParams.get(DAY_FILTER_PARAM)),
			fumigatorId: searchParams.get(FUMIGATOR_PARAM) ?? '',
			search: searchParams.get(SEARCH_PARAM) ?? '',
			status: parseStatus(searchParams.get(STATUS_PARAM)),
			clientId: searchParams.get(CLIENT_PARAM) ?? ''
		}),
		[searchParams]
	);

	const setFilter = useCallback<IUseOrdersFilters['setFilter']>(
		(key, value) => {
			const next = { ...filters, [key]: value };
			const params = new URLSearchParams();

			if (next.dayFilter !== EOrdersDayFilter.ALL) params.set(DAY_FILTER_PARAM, next.dayFilter);

			if (next.fumigatorId) params.set(FUMIGATOR_PARAM, next.fumigatorId);

			if (next.search) params.set(SEARCH_PARAM, next.search);

			if (next.status) params.set(STATUS_PARAM, next.status);

			if (next.clientId) params.set(CLIENT_PARAM, next.clientId);

			setSearchParams(params, { replace: true });
		},
		[filters, setSearchParams]
	);

	const clearFilters = useCallback(() => {
		const params = new URLSearchParams();

		if (filters.dayFilter !== EOrdersDayFilter.ALL) params.set(DAY_FILTER_PARAM, filters.dayFilter);

		setSearchParams(params, { replace: true });
	}, [filters.dayFilter, setSearchParams]);

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
