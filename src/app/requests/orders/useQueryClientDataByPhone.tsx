import { useQuery } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';
import { EClientType } from 'src/app/requests/clients/types';
import { orderKeys } from 'src/app/requests/orders/keys';

export interface IClientDataByPhonePayload {
  phone: string;
}

/** Espejo de `GetClientDataByPhoneUseCaseOutput | null` (api/.../orders/application/GetClientDataByPhone.ts). */
export type IClientDataByPhoneResponse = {
  clientAddress: string;
  clientId: string;
  clientName: string;
  clientType: EClientType;
} | null;

/** `GET /order/get-client-data/:phone`: datos del cliente registrado con ese teléfono, si existe. */
export const useQueryClientDataByPhone = (payload: IClientDataByPhonePayload, enabled?: boolean) => {
  return useQuery<IClientDataByPhoneResponse>({
    queryKey: orderKeys.clientDataByPhone(payload.phone),
    queryFn: () =>
      AxiosFetcher<IClientDataByPhoneResponse>({ url: `/order/get-client-data/${payload.phone}`, method: 'GET' }),
    enabled
  });
};
