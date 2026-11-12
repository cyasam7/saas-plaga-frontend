import { useQuery } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';
import { IClient } from 'src/app/requests/clients/types';
import { clientKeys } from 'src/app/requests/clients/keys';

export interface IGetClientPayload {
  clientId: string;
}

/** Espejo de `IGetClientByIdResponse` (api/.../client/application/GetByIdClient.ts). */
export interface IGetClientResponse extends IClient {
  /** Solo clientes B2B. */
  locations?: {
    id: string;
    name: string;
    address: string;
    contactPhone: string;
    contactPerson?: string;
    references?: string;
    areas: {
      id: string;
      name: string;
      description?: string;
    }[];
  }[];
}

/** `GET /clients/:id`: el cliente con sus ubicaciones y áreas. */
export const useQueryGetClient = (payload: IGetClientPayload, enabled?: boolean) => {
  return useQuery<IGetClientResponse>({
    queryKey: clientKeys.detail(payload.clientId),
    queryFn: () => AxiosFetcher<IGetClientResponse>({ url: `/clients/${payload.clientId}`, method: 'GET' }),
    enabled
  });
};
