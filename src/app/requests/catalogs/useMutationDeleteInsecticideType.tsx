import { useMutation } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';

export interface IDeleteInsecticideTypePayload {
  id: string;
}

/** `DELETE /insecticide-type/:id` no devuelve cuerpo. */
export type IDeleteInsecticideTypeResponse = void;

/** `DELETE /insecticide-type/:id`: elimina un producto. */
export const useMutationDeleteInsecticideType = () => {
  return useMutation<IDeleteInsecticideTypeResponse, unknown, IDeleteInsecticideTypePayload>({
    mutationFn: async (payload: IDeleteInsecticideTypePayload): Promise<IDeleteInsecticideTypeResponse> => {
      await AxiosFetcher<void>({ url: `/insecticide-type/${payload.id}`, method: 'DELETE' });
    }
  });
};
