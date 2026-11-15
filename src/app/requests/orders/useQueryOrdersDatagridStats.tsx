import { useQuery } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';
import { orderKeys } from 'src/app/requests/orders/keys';

/** Espejo de `GetDatagridOrdersStatsResponse` (api/.../orders/application/GetDatagridOrdersStats.ts). */
export interface IOrdersDatagridStatsResponse {
  total: number;
  today: number;
  tomorrow: number;
  pending: number;
  passed: number;
}

/** `GET /order/datagrid/stats`: conteo por pestaña del tenant; no depende de los filtros de la tabla. */
export const useQueryOrdersDatagridStats = (enabled?: boolean) => {
  return useQuery<IOrdersDatagridStatsResponse>({
    queryKey: orderKeys.datagridStats(),
    queryFn: () => AxiosFetcher<IOrdersDatagridStatsResponse>({ url: '/order/datagrid/stats', method: 'GET' }),
    enabled
  });
};
