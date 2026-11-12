import { useQuery } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';
import { IUserRow } from 'src/app/requests/users/types';
import { userKeys } from 'src/app/requests/users/keys';

export interface IUsersDatagridPayload {
  /** Usuario que consulta; el API lo excluye del listado. */
  userId: string;
}

/** Espejo de `IGetUsersDatagridResponse[]` (api/.../user/application/GetDatagrid.ts). */
export type IUsersDatagridResponse = IUserRow[];

/** `GET /user/datagrid`: usuarios del tenant. */
export const useQueryUsersDatagrid = (payload: IUsersDatagridPayload, enabled?: boolean) => {
  return useQuery<IUsersDatagridResponse>({
    queryKey: userKeys.datagrid(payload.userId),
    queryFn: () => AxiosFetcher<IUsersDatagridResponse>({ url: '/user/datagrid', method: 'GET', params: payload }),
    enabled
  });
};
