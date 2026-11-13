import { useQuery } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';
import { EOrdersDayFilter, EStatusOrder } from 'src/app/requests/orders/types';
import { orderKeys } from 'src/app/requests/orders/keys';

/** Espejo de `QueryDatagridOrdersDTO` (api/.../orders/infrastructure/OrderDTO.ts). */
export interface IOrdersDatagridPayload {
  dayFilter?: EOrdersDayFilter;
  fumigatorId?: string;
}

/** Espejo de `GetDatagridOrdersResponse` (api/.../orders/application/GetDatagridOrders.ts). */
export interface IOrdersDatagridResponse {
  orders: {
    id: string;
    /** ISO. */
    date: string;
    folio: string;
    client: {
      name: string;
      phone: string;
      address: string;
    };
    status: EStatusOrder;
    price: number;
    isFollowUp: boolean;
    assignedId?: string;
    assignedName?: string;
    timezone: string;
  }[];
  /** Resumen del tenant; no depende de los filtros. */
  stats: {
    total: number;
    today: number;
    tomorrow: number;
    pending: number;
    passed: number;
  };
}

/** `GET /order/datagrid`: órdenes operativas (creadas, asignadas, no visitadas) y su resumen. */
export const useQueryOrdersDatagrid = (payload: IOrdersDatagridPayload, enabled?: boolean) => {
  return useQuery<IOrdersDatagridResponse>({
    queryKey: orderKeys.datagrid(payload),
    queryFn: () => AxiosFetcher<IOrdersDatagridResponse>({ url: '/order/datagrid', method: 'GET', params: payload }),
    enabled
  });
};
