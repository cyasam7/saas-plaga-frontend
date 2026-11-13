import { useMutation } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';

export interface IDeleteClientPayload {
  clientId: string;
}

/** `DELETE /clients/:id` no devuelve cuerpo. */
export type IDeleteClientResponse = void;

/** `DELETE /clients/:id`: elimina un cliente. */
export const useMutationDeleteClient = () => {
  return useMutation<IDeleteClientResponse, unknown, IDeleteClientPayload>({
    mutationFn: async (payload: IDeleteClientPayload): Promise<IDeleteClientResponse> => {
      await AxiosFetcher<void>({ url: `/clients/${payload.clientId}`, method: 'DELETE' });
    }
  });
};
