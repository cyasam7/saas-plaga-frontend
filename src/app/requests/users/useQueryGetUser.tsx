import { useQuery } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';
import { IUserRow } from 'src/app/requests/users/types';
import { userKeys } from 'src/app/requests/users/keys';

export interface IGetUserPayload {
  userId: string;
}

/** Espejo de `IGetUserByIdResponse` (api/.../user/application/FindByIdUser.ts). */
export type IGetUserResponse = IUserRow;

/** `GET /user/:id`: un usuario del tenant. */
export const useQueryGetUser = (payload: IGetUserPayload, enabled?: boolean) => {
  return useQuery<IGetUserResponse>({
    queryKey: userKeys.detail(payload.userId),
    queryFn: () => AxiosFetcher<IGetUserResponse>({ url: `/user/${payload.userId}`, method: 'GET' }),
    enabled
  });
};
