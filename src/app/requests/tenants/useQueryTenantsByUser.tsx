import { useQuery } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';
import { tenantKeys } from 'src/app/requests/tenants/keys';

export interface ITenantsByUserPayload {
  userId: string;
}

/** Espejo de `IGetTenantsByUserResponse[]` (api/.../tenant/application/GetTenants.ts). */
export type ITenantsByUserResponse = {
  id: string;
  workspaceName: string;
  companyName: string;
}[];

/** `GET /tenant/user/:id`: tenants a los que pertenece el usuario. */
export const useQueryTenantsByUser = (payload: ITenantsByUserPayload, enabled?: boolean) => {
  return useQuery<ITenantsByUserResponse>({
    queryKey: tenantKeys.byUser(payload.userId),
    queryFn: () => AxiosFetcher<ITenantsByUserResponse>({ url: `/tenant/user/${payload.userId}`, method: 'GET' }),
    enabled
  });
};
