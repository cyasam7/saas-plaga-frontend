import { useQuery } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';
import { EOrdersDayFilter, EStatusOrder } from 'src/app/requests/orders/types';
import { orderKeys } from 'src/app/requests/orders/keys';

/** Espejo de `QueryDatagridOrdersDTO` (api/.../orders/infrastructure/OrderDTO.ts). */
export interface IOrdersDatagridPayload {
  dayFilter?: EOrdersDayFilter;
  fumigatorId?: string;
  /** Folio, cliente (nombre, teléfono, dirección) o nombre del fumigador. */
  search?: string;
  status?: EStatusOrder;
  clientId?: string;
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
    /** Es seguimiento de otra orden. */
    isFollowUp: boolean;
    /** Ya tiene seguimiento: no se puede crear otro. */
    hasNextOrder: boolean;
    assignedId?: string;
    assignedName?: string;
    timezone: string;
  }[];
}

/** `GET /order/datagrid`: órdenes operativas (creadas, asignadas, no visitadas). El resumen es `useQueryOrdersDatagridStats`. */
export const useQueryOrdersDatagrid = (payload: IOrdersDatagridPayload, enabled?: boolean) => {
  return useQuery<IOrdersDatagridResponse>({
    queryKey: orderKeys.datagrid(payload),
    queryFn: () => AxiosFetcher<IOrdersDatagridResponse>({ url: '/order/datagrid', method: 'GET', params: payload }),
    // Al cambiar un filtro se sigue mostrando la lista anterior hasta que llega la nueva.
    keepPreviousData: true,
    enabled
  });
};
