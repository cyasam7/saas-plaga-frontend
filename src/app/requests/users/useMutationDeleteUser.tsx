import { useMutation } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';

export interface IDeleteUserPayload {
  userId: string;
}

/** `DELETE /user/:id` no devuelve cuerpo. */
export type IDeleteUserResponse = void;

/** `DELETE /user/:id`: elimina un usuario. */
export const useMutationDeleteUser = () => {
  return useMutation<IDeleteUserResponse, unknown, IDeleteUserPayload>({
    mutationFn: async (payload: IDeleteUserPayload): Promise<IDeleteUserResponse> => {
      await AxiosFetcher<void>({ url: `/user/${payload.userId}`, method: 'DELETE' });
    }
  });
};
