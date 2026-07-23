import { useEffect, useMemo, useRef } from 'react';
import { useInfiniteQuery } from 'react-query';

import { OrderHistoryRow, OrderService } from 'src/app/shared/services/OrderService';

import { HISTORY_PAGE_SIZE, OrdersHistoryFilters } from '../helpers';

interface IUseOrdersHistory {
	rows: OrderHistoryRow[];
	totalCount: number;
	isLoading: boolean;
	isFetchingNextPage: boolean;
	hasNextPage: boolean;
	/** Colocar al final de la lista: al entrar al viewport dispara la siguiente página. */
	sentinelRef: React.RefObject<HTMLDivElement>;
}

export function useOrdersHistory(filters: OrdersHistoryFilters): IUseOrdersHistory {
	const sentinelRef = useRef<HTMLDivElement>(null);

	const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery({
		// Los filtros forman parte de la key: al cambiarlos la paginación se reinicia sola.
		queryKey: ['orders-history', filters],
		queryFn: ({ pageParam = 1 }) =>
			OrderService.getOrdersHistory({
				page: pageParam as number,
				take: HISTORY_PAGE_SIZE,
				status: filters.status,
				clientType: filters.clientType ?? undefined,
				dateFrom: filters.dateFrom ?? undefined,
				dateTo: filters.dateTo ?? undefined,
				search: filters.search || undefined
			}),
		getNextPageParam: (lastPage) => (lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined)
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
