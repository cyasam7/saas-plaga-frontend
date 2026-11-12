import { useQuery } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';
import { HEADER_TENANT_NAME } from 'src/app/shared-constants/headers';
import { appConfigKeys } from 'src/app/requests/app-config/keys';

export interface IGetAccountConfigPayload {
  /** Va en el header del tenant. */
  tenantId: string;
}

/** Espejo de `IResponseGetConfigAccount` (api/.../app-config/application/GetAccountConfig.ts). */
export interface IGetAccountConfigResponse {
  name: string;
  address: string;
  /** URL del logo. */
  logo: string;
  licenseSanitary: string;
  primaryColor: string;
  secondaryColor: string;
}

/** `GET /app-config/account`: datos de la empresa y colores de los reportes. */
export const useQueryGetAccountConfig = (payload: IGetAccountConfigPayload, enabled?: boolean) => {
  return useQuery<IGetAccountConfigResponse>({
    queryKey: appConfigKeys.account(payload.tenantId),
    queryFn: () =>
      AxiosFetcher<IGetAccountConfigResponse>({
        url: '/app-config/account',
        method: 'GET',
        headers: { [HEADER_TENANT_NAME]: payload.tenantId }
      }),
    enabled
  });
};
