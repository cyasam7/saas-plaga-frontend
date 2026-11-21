import { useQuery } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';
import { companyBranchKeys } from 'src/app/requests/company-branches/keys';
import { ICompanyBranchForm } from 'src/app/requests/company-branches/types';

export interface IGetCompanyBranchFormPayload {
  companyBranchId: string;
}

/** Espejo de `IGetCompanyBranchFormResponse` (api/.../company-branch/application/GetCompanyBranchForm.ts). */
export interface IGetCompanyBranchFormResponse {
  form: ICompanyBranchForm;
}

/** `GET /company-branch/:id/form`: valores editables de una sucursal. */
export const useQueryGetCompanyBranchForm = (payload: IGetCompanyBranchFormPayload, enabled?: boolean) => {
  return useQuery<IGetCompanyBranchFormResponse>({
    queryKey: companyBranchKeys.form(payload.companyBranchId),
    queryFn: () =>
      AxiosFetcher<IGetCompanyBranchFormResponse>({
        url: `/company-branch/${payload.companyBranchId}/form`,
        method: 'GET'
      }),
    enabled
  });
};
