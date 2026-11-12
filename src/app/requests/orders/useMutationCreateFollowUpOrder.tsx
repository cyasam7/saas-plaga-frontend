import { useMutation } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';

/** Espejo de `CreateFollowUpDTO` (api/.../orders/infrastructure/OrderDTO.ts). */
export interface ICreateFollowUpOrderPayload {
  /** Orden original. */
  id: string;
  description: string;
  /** ISO. */
  date: string;
}

/** `POST /order/followUp` no devuelve cuerpo. */
export type ICreateFollowUpOrderResponse = void;

/** `POST /order/followUp`: programa una orden de seguimiento a partir de otra. */
export const useMutationCreateFollowUpOrder = () => {
  return useMutation<ICreateFollowUpOrderResponse, unknown, ICreateFollowUpOrderPayload>({
    mutationFn: async (payload: ICreateFollowUpOrderPayload): Promise<ICreateFollowUpOrderResponse> => {
      await AxiosFetcher<void>({ url: '/order/followUp', method: 'POST', data: payload });
    }
  });
};
