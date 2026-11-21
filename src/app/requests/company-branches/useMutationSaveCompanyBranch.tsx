import { useMutation } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';
import { ICompanyBranchForm } from 'src/app/requests/company-branches/types';

export type ISaveCompanyBranchPayload = ICompanyBranchForm;

/** Espejo de `ISaveCompanyBranchResponse` (api/.../company-branch/application/SaveCompanyBranch.ts). */
export interface ISaveCompanyBranchResponse {
  id: string;
}

/** `PUT /company-branch`: crea o (con `id`) actualiza una sucursal. */
export const useMutationSaveCompanyBranch = () => {
  return useMutation<ISaveCompanyBranchResponse, unknown, ISaveCompanyBranchPayload>({
    mutationFn: (payload: ISaveCompanyBranchPayload) =>
      AxiosFetcher<ISaveCompanyBranchResponse>({ url: '/company-branch', method: 'PUT', data: payload }),
  });
};
