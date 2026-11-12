import { useMutation } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';
import { IBranchForm } from 'src/app/requests/branches/types';

/** Espejo de `CreateBranchFormDTO` (api/.../branch/infrastructure/BranchDto.ts). */
export interface ICreateBranchFormPayload {
  clientId: string;
  form: IBranchForm;
}

/** Espejo de `ICreateBranchFormResponse` (api/.../branch/application/CreateBranchForm.ts). */
export interface ICreateBranchFormResponse {
  id: string;
}

/** `POST /branch/form`: crea una sucursal con sus áreas. */
export const useMutationCreateBranchForm = () => {
  return useMutation<ICreateBranchFormResponse, unknown, ICreateBranchFormPayload>({
    mutationFn: (payload: ICreateBranchFormPayload) =>
      AxiosFetcher<ICreateBranchFormResponse>({ url: '/branch/form', method: 'POST', data: payload })
  });
};
