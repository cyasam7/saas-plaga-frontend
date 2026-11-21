import { useCallback, useMemo } from 'react';

import useDebounce from 'src/app/shared/hooks/useDebounce';
import useFilterParams from 'src/app/shared/hooks/useFilterParams';
import { EClientType } from 'src/app/requests/clients/types';
import { EStatusOrder } from 'src/app/requests/orders/types';

import { HISTORY_STATUSES, OrdersHistoryFilters } from '../helpers';

const SEARCH_DEBOUNCE_MS = 400;
const HISTORY_FILTER_KEYS = ['dateFrom', 'dateTo', 'status', 'clientType', 'fumigatorId', 'search'] as const;

type HistoryFilterParams = Record<(typeof HISTORY_FILTER_KEYS)[number], string>;

interface IUseOrdersHistoryFilters {
	/** Valores inmediatos para los inputs. */
	filters: OrdersHistoryFilters;
	/** Lo que se manda al API: igual que `filters` pero con la búsqueda con debounce. */
	queryFilters: OrdersHistoryFilters;
	hasActiveFilters: boolean;
	setFilter: <K extends keyof OrdersHistoryFilters>(key: K, value: OrdersHistoryFilters[K]) => void;
	clearFilters: () => void;
}

/** Convierte los query params a filtros tipados, descartando valores inválidos. */
function parseHistoryFilters(filterParams: HistoryFilterParams): OrdersHistoryFilters {
	const status = filterParams.status
		.split(',')
		.filter((statusValue): statusValue is EStatusOrder => HISTORY_STATUSES.includes(statusValue as EStatusOrder));
	const isValidClientType = Object.values(EClientType).includes(filterParams.clientType as EClientType);

	return {
		dateFrom: filterParams.dateFrom || null,
		dateTo: filterParams.dateTo || null,
		status,
		clientType: isValidClientType ? (filterParams.clientType as EClientType) : null,
		fumigatorId: filterParams.fumigatorId,
		search: filterParams.search
	};
}

/**
 * Los filtros viven en los query params: la vista es enlazable, sobrevive el refresh
 * y el back/forward navega entre estados de filtro.
 */
export function useOrdersHistoryFilters(): IUseOrdersHistoryFilters {
	const { filters: filterParams, setFilters, clearFilters, hasActiveFilters } = useFilterParams(HISTORY_FILTER_KEYS);

	const filters = useMemo(() => parseHistoryFilters(filterParams), [filterParams]);

	const setFilter = useCallback<IUseOrdersHistoryFilters['setFilter']>(
		(key, value) => {
			const paramValue = Array.isArray(value) ? value.join(',') : (value ?? '');
			setFilters({ [key]: paramValue });
		},
		[setFilters]
	);

	// La búsqueda espera a que se deje de escribir para no pedir al API en cada tecla.
	const { debounceValue: debouncedSearch } = useDebounce(filters.search, SEARCH_DEBOUNCE_MS);
	const search = (debouncedSearch ?? filters.search).trim();

	const queryFilters = useMemo(() => ({ ...filters, search }), [filters, search]);

	return { filters, queryFilters, hasActiveFilters, setFilter, clearFilters };
}

export default useOrdersHistoryFilters;
