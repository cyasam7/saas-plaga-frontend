import { useMutation } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';
import { IBranchForm } from 'src/app/requests/branches/types';

export interface IUpdateBranchFormPayload {
  branchId: string;
  form: IBranchForm;
}

/** `PUT /branch/:id` no devuelve cuerpo. */
export type IUpdateBranchFormResponse = void;

/** `PUT /branch/:id`: reemplaza la sucursal y sus áreas con el `form` completo. */
export const useMutationUpdateBranchForm = () => {
  return useMutation<IUpdateBranchFormResponse, unknown, IUpdateBranchFormPayload>({
    mutationFn: async (payload: IUpdateBranchFormPayload): Promise<IUpdateBranchFormResponse> => {
      await AxiosFetcher<void>({ url: `/branch/${payload.branchId}`, method: 'PUT', data: payload.form });
    }
  });
};
