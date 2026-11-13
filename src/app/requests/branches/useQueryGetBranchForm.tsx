import { useQuery } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';
import { IBranchForm } from 'src/app/requests/branches/types';
import { branchKeys } from 'src/app/requests/branches/keys';

export interface IGetBranchFormPayload {
  branchId: string;
}

/** Espejo de `IGetBranchFormResponse` (api/.../branch/application/GetBranchForm.ts). */
export interface IGetBranchFormResponse {
  id: string;
  clientId: string;
  form: IBranchForm;
}

/** `GET /branch/:id/form`: valores editables de la sucursal y sus áreas. */
export const useQueryGetBranchForm = (payload: IGetBranchFormPayload, enabled?: boolean) => {
  return useQuery<IGetBranchFormResponse>({
    queryKey: branchKeys.form(payload.branchId),
    queryFn: () => AxiosFetcher<IGetBranchFormResponse>({ url: `/branch/${payload.branchId}/form`, method: 'GET' }),
    enabled,
    cacheTime: 0
  });
};
