import { useMutation } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';
import { ERoleCode } from 'src/app/requests/users/types';

/** Espejo de `CreateUserDTO` (api/.../user/infrastructure/UserDto.ts). Con `id` actualiza. */
export interface ISaveUserPayload {
  id?: string;
  name: string;
  phone: string;
  email: string;
  password?: string;
  roleCode: ERoleCode;
  tenantId?: string;
}

/** Espejo de `ISaveUserResponse` (api/.../user/application/SaveUser.ts). */
export interface ISaveUserResponse {
  id: string;
}

/** `PUT /user`: crea o (con `id`) actualiza un usuario. */
export const useMutationSaveUser = () => {
  return useMutation<ISaveUserResponse, unknown, ISaveUserPayload>({
    mutationFn: (payload: ISaveUserPayload) =>
      AxiosFetcher<ISaveUserResponse>({ url: '/user', method: 'PUT', data: payload })
  });
};
