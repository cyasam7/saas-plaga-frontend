import { useCallback, useMemo, useState } from 'react';
import { useQuery } from 'react-query';

import { OrderService } from 'src/app/shared/services/OrderService';
import useOrdersFilters from '../../hooks/useOrdersFilters';
import { OrdersAdminFilters } from '../types';
import { EMPTY_ADMIN_FILTERS, countActiveFilters, filterOrders } from '../utils';

const EMPTY_DATAGRID = { orders: [], stats: { total: 0, today: 0, tomorrow: 0, pending: 0, passed: 0 } };

/**
 * Día (tab) y fumigador viven en la URL y los resuelve el API; búsqueda, fechas, estatus y
 * cliente se aplican en el cliente sobre la lista ya cargada (el endpoint no pagina).
 */
export function useOrdersAdmin() {
	const { filters: urlFilters, query, setFilter: setUrlFilter } = useOrdersFilters();
	const [adminFilters, setAdminFilters] = useState<OrdersAdminFilters>(EMPTY_ADMIN_FILTERS);

	// Misma key que la página de órdenes: los diálogos reutilizados invalidan 'orders'.
	const { data = EMPTY_DATAGRID, isLoading, refetch } = useQuery({
		queryKey: ['orders', query],
		queryFn: () => OrderService.getDatagridOrders(query)
	});

	const visibleOrders = useMemo(() => filterOrders(data.orders, adminFilters), [data.orders, adminFilters]);

	const clientNames = useMemo(() => {
		const uniqueClientNames = new Set(data.orders.map((order) => order.client.name));

		if (adminFilters.clientName) uniqueClientNames.add(adminFilters.clientName);

		return [...uniqueClientNames].sort((first, second) => first.localeCompare(second));
	}, [data.orders, adminFilters.clientName]);

	const setAdminFilter = useCallback(
		<K extends keyof OrdersAdminFilters>(key: K, value: OrdersAdminFilters[K]) =>
			setAdminFilters((currentFilters) => ({ ...currentFilters, [key]: value })),
		[]
	);

	const clearFilters = useCallback(() => {
		setAdminFilters(EMPTY_ADMIN_FILTERS);
		setUrlFilter('fumigatorId', '');
	}, [setUrlFilter]);

	const activeFilterCount = countActiveFilters(adminFilters, urlFilters.fumigatorId);

	return {
		urlFilters,
		setUrlFilter,
		adminFilters,
		setAdminFilter,
		clearFilters,
		activeFilterCount,
		hasFilters: activeFilterCount > 0 || Boolean(adminFilters.search.trim()),
		visibleOrders,
		loadedOrdersCount: data.orders.length,
		stats: data.stats,
		clientNames,
		isLoading,
		refetch
	};
}

export default useOrdersAdmin;
