import { useMutation } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';

export interface IDeletePestTypePayload {
  id: string;
}

/** `DELETE /plague-type/:id` no devuelve cuerpo. */
export type IDeletePestTypeResponse = void;

/** `DELETE /plague-type/:id`: elimina un elemento de tipos de plaga. */
export const useMutationDeletePestType = () => {
  return useMutation<IDeletePestTypeResponse, unknown, IDeletePestTypePayload>({
    mutationFn: async (payload: IDeletePestTypePayload): Promise<IDeletePestTypeResponse> => {
      await AxiosFetcher<void>({ url: `/plague-type/${payload.id}`, method: 'DELETE' });
    }
  });
};
