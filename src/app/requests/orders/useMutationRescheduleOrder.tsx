import { useMutation } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';

export interface IRescheduleOrderPayload {
  orderId: string;
  /** Cuerpo: `RescheduleOrderDTO` (api/.../orders/infrastructure/OrderDTO.ts). ISO. */
  date: string;
}

/** `PATCH /order/reschedule/:id` no devuelve cuerpo. */
export type IRescheduleOrderResponse = void;

/** `PATCH /order/reschedule/:id`: cambia la fecha de una orden creada, asignada o no realizada. */
export const useMutationRescheduleOrder = () => {
  return useMutation<IRescheduleOrderResponse, unknown, IRescheduleOrderPayload>({
    mutationFn: async (payload: IRescheduleOrderPayload): Promise<IRescheduleOrderResponse> => {
      await AxiosFetcher<void>({
        url: `/order/reschedule/${payload.orderId}`,
        method: 'PATCH',
        data: { date: payload.date }
      });
    }
  });
};
