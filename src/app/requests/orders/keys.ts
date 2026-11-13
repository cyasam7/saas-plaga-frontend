import { IOrdersDatagridPayload } from 'src/app/requests/orders/useQueryOrdersDatagrid';
import { IOrdersHistoryPayload } from 'src/app/requests/orders/useQueryOrdersHistory';

/**
 * Query keys del dominio de órdenes. Todas cuelgan de `orderKeys.all`, así que invalidar
 * `orderKeys.all` refresca listados, historial y detalle.
 */
export const orderKeys = {
  all: ['orders'] as const,
  datagrid: (payload: IOrdersDatagridPayload) => [...orderKeys.all, 'datagrid', payload] as const,
  history: (payload: IOrdersHistoryPayload) => [...orderKeys.all, 'history', payload] as const,
  detail: (orderId: string) => [...orderKeys.all, 'detail', orderId] as const,
  fumigatorsToAssign: () => [...orderKeys.all, 'fumigators-to-assign'] as const,
  clientDataByPhone: (phone: string) => [...orderKeys.all, 'client-data-by-phone', phone] as const
};
