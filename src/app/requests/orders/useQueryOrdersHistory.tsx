import { useInfiniteQuery } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';
import { EClientType } from 'src/app/requests/clients/types';
import { EStatusOrder } from 'src/app/requests/orders/types';
import { orderKeys } from 'src/app/requests/orders/keys';

/** Espejo de `QueryOrdersHistoryDTO` sin la página (la maneja la paginación infinita). */
export interface IOrdersHistoryPayload {
  take: number;
  status?: EStatusOrder[];
  clientType?: EClientType;
  /** `YYYY-MM-DD`. */
  dateFrom?: string;
  /** `YYYY-MM-DD`. */
  dateTo?: string;
  search?: string;
  fumigatorId?: string;
}

/** Espejo de `Paginated<OrderHistoryRowResponse>` (api/.../orders/application/GetOrdersHistory.ts). */
export interface IOrdersHistoryResponse {
  data: {
    id: string;
    folio: string;
    /** ISO. */
    date: string;
    timezone: string;
    status: EStatusOrder;
    price: number;
    clientName: string;
    clientType: EClientType | null;
    fumigatorName: string | null;
  }[];
  meta: {
    page: number;
    take: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

/** `GET /order/history`: historial paginado (scroll infinito) de órdenes ya trabajadas. */
export const useQueryOrdersHistory = (payload: IOrdersHistoryPayload, enabled?: boolean) => {
  return useInfiniteQuery<IOrdersHistoryResponse>({
    queryKey: orderKeys.history(payload),
    queryFn: ({ pageParam = 1 }) => {
      const { status, ...query } = payload;

      return AxiosFetcher<IOrdersHistoryResponse>({
        url: '/order/history',
        method: 'GET',
        // El API recibe los estatus como lista separada por coma.
        params: { ...query, page: pageParam, ...(status?.length ? { status: status.join(',') } : {}) }
      });
    },
    getNextPageParam: (lastPage) => (lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined),
    enabled
  });
};
