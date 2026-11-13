import { useEffect, useMemo, useRef } from 'react';

import { IOrdersHistoryResponse, useQueryOrdersHistory } from 'src/app/requests/orders/useQueryOrdersHistory';

import { HISTORY_PAGE_SIZE, OrdersHistoryFilters } from '../helpers';

interface IUseOrdersHistory {
	rows: IOrdersHistoryResponse['data'];
	totalCount: number;
	isLoading: boolean;
	isFetchingNextPage: boolean;
	hasNextPage: boolean;
	/** Colocar al final de la lista: al entrar al viewport dispara la siguiente página. */
	sentinelRef: React.RefObject<HTMLDivElement>;
}

export function useOrdersHistory(filters: OrdersHistoryFilters): IUseOrdersHistory {
	const sentinelRef = useRef<HTMLDivElement>(null);

	// Los filtros forman parte de la key: al cambiarlos la paginación se reinicia sola.
	const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useQueryOrdersHistory({
		take: HISTORY_PAGE_SIZE,
		status: filters.status,
		clientType: filters.clientType ?? undefined,
		dateFrom: filters.dateFrom ?? undefined,
		dateTo: filters.dateTo ?? undefined,
		fumigatorId: filters.fumigatorId || undefined,
		search: filters.search || undefined
	});

	const rows = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data]);
	const totalCount = data?.pages[0]?.meta.itemCount ?? 0;

	useEffect(() => {
		const sentinel = sentinelRef.current;

		if (!sentinel || !hasNextPage) return undefined;

		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				void fetchNextPage();
			}
		});

		observer.observe(sentinel);

		return () => observer.disconnect();
	}, [hasNextPage, fetchNextPage, rows.length]);

	return {
		rows,
		totalCount,
		isLoading,
		isFetchingNextPage,
		hasNextPage: Boolean(hasNextPage),
		sentinelRef
	};
}

export default useOrdersHistory;
