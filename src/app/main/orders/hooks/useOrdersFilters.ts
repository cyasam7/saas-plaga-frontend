import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { EOrdersDayFilter, IQueryDatagridOrders } from 'src/app/shared/services/OrderService';

const DAY_FILTER_PARAM = 'dayFilter';
const FUMIGATOR_PARAM = 'fumigatorId';

const DAY_FILTERS = Object.values(EOrdersDayFilter);

export interface OrdersFilters {
	dayFilter: EOrdersDayFilter;
	/** Cadena vacía = todos los fumigadores. */
	fumigatorId: string;
}

interface IUseOrdersFilters {
	filters: OrdersFilters;
	/** Lo que se manda al API: se omiten los valores neutros. */
	query: IQueryDatagridOrders;
	setFilter: <K extends keyof OrdersFilters>(key: K, value: OrdersFilters[K]) => void;
}

function parseDayFilter(value: string | null): EOrdersDayFilter {
	return DAY_FILTERS.includes(value as EOrdersDayFilter) ? (value as EOrdersDayFilter) : EOrdersDayFilter.ALL;
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
			fumigatorId: searchParams.get(FUMIGATOR_PARAM) ?? ''
		}),
		[searchParams]
	);

	const setFilter = useCallback<IUseOrdersFilters['setFilter']>(
		(key, value) => {
			const next = { ...filters, [key]: value };
			const params = new URLSearchParams();

			if (next.dayFilter !== EOrdersDayFilter.ALL) params.set(DAY_FILTER_PARAM, next.dayFilter);

			if (next.fumigatorId) params.set(FUMIGATOR_PARAM, next.fumigatorId);

			setSearchParams(params, { replace: true });
		},
		[filters, setSearchParams]
	);

	const query = useMemo<IQueryDatagridOrders>(
		() => ({
			dayFilter: filters.dayFilter,
			...(filters.fumigatorId ? { fumigatorId: filters.fumigatorId } : {})
		}),
		[filters]
	);

	return { filters, query, setFilter };
}

export default useOrdersFilters;
