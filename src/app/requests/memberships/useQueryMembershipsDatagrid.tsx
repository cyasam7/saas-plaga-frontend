import { useQuery } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';
import { EMembershipType } from 'src/app/requests/memberships/types';
import { membershipKeys } from 'src/app/requests/memberships/keys';

export type IMembershipsDatagridPayload = void;

/** Espejo de `IGetMembershipsDatagridResponse[]` (api/.../membership/application/GetDataGridMemberships.ts). */
export type IMembershipsDatagridResponse = {
  id: string;
  tenantId: string;
  tenantName: string;
  /** ISO. */
  dueDate: string;
  type: EMembershipType;
  ownerId: string;
  owner: string;
  ownerEmail: string;
  isActive: boolean;
}[];

/** `GET /membership`: membresías de todos los tenants (super admin). */
export const useQueryMembershipsDatagrid = (_payload?: IMembershipsDatagridPayload, enabled?: boolean) => {
  return useQuery<IMembershipsDatagridResponse>({
    queryKey: membershipKeys.datagrid(),
    queryFn: () => AxiosFetcher<IMembershipsDatagridResponse>({ url: '/membership', method: 'GET' }),
    enabled
  });
};
