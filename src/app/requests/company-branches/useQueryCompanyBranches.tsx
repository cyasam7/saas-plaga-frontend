import { useQuery } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';
import { companyBranchKeys } from 'src/app/requests/company-branches/keys';

export interface ICompanyBranchesPayload {
  search: string;
}

/** Espejo de `IGetCompanyBranchesResponse[]` (api/.../company-branch/application/GetCompanyBranches.ts). */
export type ICompanyBranchesResponse = {
  id: string;
  name: string;
  address: string;
  /** La matriz se crea con el tenant y no se puede eliminar. */
  isMain: boolean;
}[];

/** `GET /company-branch`: sucursales del tenant, filtradas por nombre o dirección. */
export const useQueryCompanyBranches = (payload: ICompanyBranchesPayload, enabled?: boolean) => {
  return useQuery<ICompanyBranchesResponse>({
    queryKey: companyBranchKeys.list(payload.search),
    queryFn: () =>
      AxiosFetcher<ICompanyBranchesResponse>({
        url: '/company-branch',
        method: 'GET',
        params: payload.search ? { search: payload.search } : undefined
      }),
    keepPreviousData: true,
    enabled
  });
};
