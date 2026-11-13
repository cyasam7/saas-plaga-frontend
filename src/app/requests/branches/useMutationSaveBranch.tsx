import { useMutation } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';

/** Espejo de `CreateBranchDTO` (api/.../branch/infrastructure/BranchDto.ts): alta rápida sin áreas. */
export interface ISaveBranchPayload {
  id?: string;
  clientId: string;
  name: string;
  address: string;
  contactPerson: string;
  contactPhone: string;
  notes?: string;
}

/** `POST /branch` no devuelve cuerpo. */
export type ISaveBranchResponse = void;

/** `POST /branch`: crea (o con `id` actualiza) una sucursal sin tocar sus áreas. */
export const useMutationSaveBranch = () => {
  return useMutation<ISaveBranchResponse, unknown, ISaveBranchPayload>({
    mutationFn: async (payload: ISaveBranchPayload): Promise<ISaveBranchResponse> => {
      await AxiosFetcher<void>({ url: '/branch', method: 'POST', data: payload });
    }
  });
};
