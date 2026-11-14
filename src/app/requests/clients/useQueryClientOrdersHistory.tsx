import { useQuery } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';
import { EStatusOrder } from 'src/app/requests/orders/types';
import { clientKeys } from 'src/app/requests/clients/keys';

export interface IClientOrdersHistoryPayload {
  clientId: string;
}

interface IClientOrderHistoryCatalog {
  id: string;
  label: string;
  value: string;
}

/** Espejo de `ClientOrderHistoryResponse[]` (api/.../client/application/GetClientOrdersHistory.ts). */
export type IClientOrdersHistoryResponse = {
  id: string;
  folioNumber: string;
  /** ISO. */
  date: string;
  status: EStatusOrder;
  price: number;
  observations: string | null;
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  assigned: { id: string; name: string } | null;
  servicesType: IClientOrderHistoryCatalog[];
  applicationsType: IClientOrderHistoryCatalog[];
  pests: IClientOrderHistoryCatalog[];
  productsApplied: {
    id: string;
    productName: string;
    chemicalName: string;
    productDose: string;
  }[];
  /** Siguiente orden de la cadena (el seguimiento que generó); `null` si no tiene. */
  nextOrder: {
    id: string;
    folioNumber: string;
    /** ISO. */
    date: string;
    status: EStatusOrder;
  } | null;
  /** Orden de la que salió este seguimiento; `null` si no es seguimiento. */
  previousOrder: {
    id: string;
    folioNumber: string;
    /** ISO. */
    date: string;
    status: EStatusOrder;
  } | null;
}[];

/** `GET /clients/:id/orders`: historial completo de órdenes del cliente. */
export const useQueryClientOrdersHistory = (payload: IClientOrdersHistoryPayload, enabled?: boolean) => {
  return useQuery<IClientOrdersHistoryResponse>({
    queryKey: clientKeys.ordersHistory(payload.clientId),
    queryFn: () =>
      AxiosFetcher<IClientOrdersHistoryResponse>({ url: `/clients/${payload.clientId}/orders`, method: 'GET' }),
    enabled
  });
};
