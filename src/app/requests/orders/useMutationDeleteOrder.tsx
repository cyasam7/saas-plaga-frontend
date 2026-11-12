import { useMutation } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';

export interface IDeleteOrderPayload {
  orderId: string;
}

/** `DELETE /order/:id` no devuelve cuerpo. */
export type IDeleteOrderResponse = void;

/** `DELETE /order/:id`: elimina una orden. */
export const useMutationDeleteOrder = () => {
  return useMutation<IDeleteOrderResponse, unknown, IDeleteOrderPayload>({
    mutationFn: async (payload: IDeleteOrderPayload): Promise<IDeleteOrderResponse> => {
      await AxiosFetcher<void>({ url: `/order/${payload.orderId}`, method: 'DELETE' });
    }
  });
};
