import { useMutation } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';
import { ICreateOrderPayload } from 'src/app/requests/orders/types';

/** Espejo de `CreateIndividualOrderDTO` (api/.../orders/infrastructure/OrderDTO.ts). */
export type ICreateIndividualOrderPayload = ICreateOrderPayload;

/** Espejo de `ICreateIndividualOrderResponse` (api/.../orders/application/CreateIndividualOrder.ts). */
export interface ICreateIndividualOrderResponse {
  id: string;
}

/** `POST /order/individual`: crea una orden residencial (y el cliente si no existe). */
export const useMutationCreateIndividualOrder = () => {
  return useMutation<ICreateIndividualOrderResponse, unknown, ICreateIndividualOrderPayload>({
    mutationFn: (payload: ICreateIndividualOrderPayload) =>
      AxiosFetcher<ICreateIndividualOrderResponse>({ url: '/order/individual', method: 'POST', data: payload })
  });
};
