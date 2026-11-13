import { useQuery } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';
import { ClientType, IClient } from 'src/app/requests/clients/types';
import { clientKeys } from 'src/app/requests/clients/keys';

export interface IClientsPayload {
  name?: string;
  type?: ClientType;
  phone?: string;
}

/** Espejo de `IGetClientsByQueryResponse[]` (api/.../client/application/GetByQueryClient.ts). */
export type IClientsResponse = IClient[];

/** `GET /clients`: clientes del tenant, filtrables por nombre, tipo o teléfono. */
export const useQueryClients = (payload: IClientsPayload, enabled?: boolean) => {
  return useQuery<IClientsResponse>({
    queryKey: clientKeys.list(payload),
    queryFn: () => AxiosFetcher<IClientsResponse>({ url: '/clients', method: 'GET', params: payload }),
    enabled
  });
};
