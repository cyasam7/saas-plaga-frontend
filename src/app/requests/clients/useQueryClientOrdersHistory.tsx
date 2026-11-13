import { useQuery } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';
import { ClientType } from 'src/app/requests/clients/types';
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
  isFollowUp: boolean;
  hasFollowUp: boolean;
  /** ISO. */
  dateFollowUp: string | null;
  daysFollowUp: number | null;
  observations: string | null;
  timeZone: string;
  clientId: string;
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  clientType: ClientType;
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
  areaInfestations: {
    areaId?: string;
    areaName?: string;
    skipped: boolean;
    infestationLvl?: string;
    skipReason?: string;
    skipReasonOther?: string;
  }[];
  includeCertificate: boolean;
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
