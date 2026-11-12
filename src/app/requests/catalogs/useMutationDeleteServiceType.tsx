import { useMutation } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';

export interface IDeleteServiceTypePayload {
  id: string;
}

/** `DELETE /service-type/:id` no devuelve cuerpo. */
export type IDeleteServiceTypeResponse = void;

/** `DELETE /service-type/:id`: elimina un elemento de tipos de servicio. */
export const useMutationDeleteServiceType = () => {
  return useMutation<IDeleteServiceTypeResponse, unknown, IDeleteServiceTypePayload>({
    mutationFn: async (payload: IDeleteServiceTypePayload): Promise<IDeleteServiceTypeResponse> => {
      await AxiosFetcher<void>({ url: `/service-type/${payload.id}`, method: 'DELETE' });
    }
  });
};
