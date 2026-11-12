import { useQuery } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';
import { orderKeys } from 'src/app/requests/orders/keys';

export type IFumigatorsToAssignOrderPayload = void;

/** Espejo de `IUserValidToStartOrder[]` (api/.../orders/application/GetFumigatorToAssignOrderUseCase.ts). */
export type IFumigatorsToAssignOrderResponse = {
  userId: string;
  name: string;
  disabled: boolean;
}[];

/** `GET /order/fumigators-to-assign-order`: fumigadores del tenant a los que se puede asignar una orden. */
export const useQueryFumigatorsToAssignOrder = (_payload?: IFumigatorsToAssignOrderPayload, enabled?: boolean) => {
  return useQuery<IFumigatorsToAssignOrderResponse>({
    queryKey: orderKeys.fumigatorsToAssign(),
    queryFn: () =>
      AxiosFetcher<IFumigatorsToAssignOrderResponse>({ url: '/order/fumigators-to-assign-order', method: 'GET' }),
    enabled
  });
};
