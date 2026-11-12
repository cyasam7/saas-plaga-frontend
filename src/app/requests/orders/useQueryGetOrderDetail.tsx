import { useQuery } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';
import { EClientType } from 'src/app/requests/clients/types';
import { EStatusOrder } from 'src/app/requests/orders/types';
import { orderKeys } from 'src/app/requests/orders/keys';

export interface IGetOrderDetailPayload {
  orderId: string;
}

interface IOrderDetailCatalog {
  id: string;
  label: string;
  value: string;
}

/** Espejo de `OrderDetailResponse` (api/.../orders/application/GetOrderDetail.ts). */
export interface IGetOrderDetailResponse {
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
  clientType: EClientType;
  assigned: { id: string; name: string } | null;
  servicesType: IOrderDetailCatalog[];
  applicationsType: IOrderDetailCatalog[];
  pests: IOrderDetailCatalog[];
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
}

/** `GET /order/:id`: detalle completo de una orden. */
export const useQueryGetOrderDetail = (payload: IGetOrderDetailPayload, enabled?: boolean) => {
  return useQuery<IGetOrderDetailResponse>({
    queryKey: orderKeys.detail(payload.orderId),
    queryFn: () => AxiosFetcher<IGetOrderDetailResponse>({ url: `/order/${payload.orderId}`, method: 'GET' }),
    enabled
  });
};
