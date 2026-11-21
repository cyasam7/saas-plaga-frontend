import { useMutation } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';

export interface IDeleteCompanyBranchPayload {
  companyBranchId: string;
}

/** `DELETE /company-branch/:id` no devuelve cuerpo. */
export type IDeleteCompanyBranchResponse = void;

/** `DELETE /company-branch/:id`: elimina una sucursal. */
export const useMutationDeleteCompanyBranch = () => {
  return useMutation<IDeleteCompanyBranchResponse, unknown, IDeleteCompanyBranchPayload>({
    mutationFn: async (payload: IDeleteCompanyBranchPayload): Promise<IDeleteCompanyBranchResponse> => {
      await AxiosFetcher<void>({ url: `/company-branch/${payload.companyBranchId}`, method: 'DELETE' });
    }
  });
};
