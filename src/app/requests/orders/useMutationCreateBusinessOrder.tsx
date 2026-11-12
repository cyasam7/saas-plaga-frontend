import { useMutation } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';
import { ICreateOrderPayload } from 'src/app/requests/orders/types';

/** Espejo de `CreateBusinessOrderDTO` (api/.../orders/infrastructure/OrderDTO.ts). */
export type ICreateBusinessOrderPayload = ICreateOrderPayload;

/** Espejo de `ICreateBusinessOrderResponse` (api/.../orders/application/CreateBusinessOrder.ts). */
export interface ICreateBusinessOrderResponse {
  id: string;
}

/** `POST /order/business`: crea una orden B2B (y el cliente con su ubicación si no existe). */
export const useMutationCreateBusinessOrder = () => {
  return useMutation<ICreateBusinessOrderResponse, unknown, ICreateBusinessOrderPayload>({
    mutationFn: (payload: ICreateBusinessOrderPayload) =>
      AxiosFetcher<ICreateBusinessOrderResponse>({ url: '/order/business', method: 'POST', data: payload })
  });
};
