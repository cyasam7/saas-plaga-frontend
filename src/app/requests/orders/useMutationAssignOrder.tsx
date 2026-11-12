import { useMutation } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';

export interface IAssignOrderPayload {
  orderId: string;
  /** Cuerpo: `UpdateAssignedOrderDTO` (api/.../orders/infrastructure/OrderDTO.ts). */
  userId: string;
}

/** `PATCH /order/assign-user/:id` no devuelve cuerpo. */
export type IAssignOrderResponse = void;

/** `PATCH /order/assign-user/:id`: asigna (o reasigna) la orden a un fumigador. */
export const useMutationAssignOrder = () => {
  return useMutation<IAssignOrderResponse, unknown, IAssignOrderPayload>({
    mutationFn: async (payload: IAssignOrderPayload): Promise<IAssignOrderResponse> => {
      await AxiosFetcher<void>({
        url: `/order/assign-user/${payload.orderId}`,
        method: 'PATCH',
        data: { userId: payload.userId }
      });
    }
  });
};
