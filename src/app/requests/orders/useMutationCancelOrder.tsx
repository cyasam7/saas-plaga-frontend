import { useMutation } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';

export interface ICancelOrderPayload {
  orderId: string;
}

/** `PATCH /order/cancel/:id` no devuelve cuerpo. */
export type ICancelOrderResponse = void;

/** `PATCH /order/cancel/:id`: cancela una orden creada, asignada o no realizada. */
export const useMutationCancelOrder = () => {
  return useMutation<ICancelOrderResponse, unknown, ICancelOrderPayload>({
    mutationFn: async (payload: ICancelOrderPayload): Promise<ICancelOrderResponse> => {
      await AxiosFetcher<void>({
        url: `/order/cancel/${payload.orderId}`,
        method: 'PATCH'
      });
    }
  });
};
