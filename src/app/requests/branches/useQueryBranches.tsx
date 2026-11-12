import { useQuery } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';
import { branchKeys } from 'src/app/requests/branches/keys';

export interface IBranchesPayload {
  clientId?: string;
  name?: string;
}

/** Espejo de `IGetBranchesByQueryResponse[]` (api/.../branch/application/GetByQueryBranch.ts). */
export type IBranchesResponse = {
  id: string;
  clientId: string;
  name: string;
  address: string;
  contactPerson: string;
  contactPhone: string;
  notes: string;
  tenantId: string;
  areas: {
    id: string;
    name: string;
    description: string | null;
  }[];
}[];

/** `GET /branch`: sucursales del tenant con sus áreas, filtrables por cliente o nombre. */
export const useQueryBranches = (payload: IBranchesPayload, enabled?: boolean) => {
  return useQuery<IBranchesResponse>({
    queryKey: branchKeys.list(payload),
    queryFn: () => AxiosFetcher<IBranchesResponse>({ url: '/branch', method: 'GET', params: payload }),
    enabled
  });
};
