import { useMutation } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';

export interface IDeleteBranchPayload {
  branchId: string;
}

/** `DELETE /branch/:id` no devuelve cuerpo. */
export type IDeleteBranchResponse = void;

/** `DELETE /branch/:id`: elimina una sucursal. */
export const useMutationDeleteBranch = () => {
  return useMutation<IDeleteBranchResponse, unknown, IDeleteBranchPayload>({
    mutationFn: async (payload: IDeleteBranchPayload): Promise<IDeleteBranchResponse> => {
      await AxiosFetcher<void>({ url: `/branch/${payload.branchId}`, method: 'DELETE' });
    }
  });
};
