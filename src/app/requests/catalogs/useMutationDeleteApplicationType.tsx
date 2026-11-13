import { useMutation } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';

export interface IDeleteApplicationTypePayload {
  id: string;
}

/** `DELETE /application-type/:id` no devuelve cuerpo. */
export type IDeleteApplicationTypeResponse = void;

/** `DELETE /application-type/:id`: elimina un elemento de tipos de aplicación. */
export const useMutationDeleteApplicationType = () => {
  return useMutation<IDeleteApplicationTypeResponse, unknown, IDeleteApplicationTypePayload>({
    mutationFn: async (payload: IDeleteApplicationTypePayload): Promise<IDeleteApplicationTypeResponse> => {
      await AxiosFetcher<void>({ url: `/application-type/${payload.id}`, method: 'DELETE' });
    }
  });
};
