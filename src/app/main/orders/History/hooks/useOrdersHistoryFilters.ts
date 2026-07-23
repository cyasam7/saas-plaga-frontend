import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import useDebounce from 'src/app/shared-hooks/useDebounce';

import { EMPTY_FILTERS, filtersToParams, OrdersHistoryFilters, parseFiltersFromParams } from '../helpers';

const SEARCH_DEBOUNCE_MS = 400;

interface IUseOrdersHistoryFilters {
	filters: OrdersHistoryFilters;
	/** Valor inmediato del input de búsqueda (la URL se actualiza con debounce). */
	searchInput: string;
	setSearchInput: (value: string) => void;
	setFilter: <K extends keyof OrdersHistoryFilters>(key: K, value: OrdersHistoryFilters[K]) => void;
	clearFilters: () => void;
}

/**
 * Los filtros viven en los query params: la vista es enlazable, sobrevive el refresh
 * y el back/forward navega entre estados de filtro.
 */
export function useOrdersHistoryFilters(): IUseOrdersHistoryFilters {
	const [searchParams, setSearchParams] = useSearchParams();

	const filters = useMemo(() => parseFiltersFromParams(searchParams), [searchParams]);

	const [searchInput, setSearchInput] = useState<string>(filters.search);
	const { debounceValue } = useDebounce(searchInput, SEARCH_DEBOUNCE_MS);

	const writeFilters = useCallback(
		(next: OrdersHistoryFilters) => {
			setSearchParams(filtersToParams(next), { replace: true });
		},
		[setSearchParams]
	);

	const setFilter = useCallback<IUseOrdersHistoryFilters['setFilter']>(
		(key, value) => {
			writeFilters({ ...filters, [key]: value });
		},
		[filters, writeFilters]
	);

	const clearFilters = useCallback(() => {
		setSearchInput('');
		writeFilters(EMPTY_FILTERS);
	}, [writeFilters]);

	// El texto solo llega a la URL (y por lo tanto al backend) cuando el usuario deja de escribir.
	useEffect(() => {
		if (debounceValue === null || debounceValue === filters.search) return;

		writeFilters({ ...filters, search: debounceValue });
	}, [debounceValue, filters, writeFilters]);

	return { filters, searchInput, setSearchInput, setFilter, clearFilters };
}

export default useOrdersHistoryFilters;
