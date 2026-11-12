import { useMutation } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';

export interface IChangeUserPasswordPayload {
  userId: string;
  /** Cuerpo: `ChangePasswordDTO` (api/.../user/infrastructure/UserDto.ts). */
  password: string;
}

/** `PATCH /user/change-password/:id` no devuelve cuerpo. */
export type IChangeUserPasswordResponse = void;

/** `PATCH /user/change-password/:id`: asigna una nueva contraseña al usuario. */
export const useMutationChangeUserPassword = () => {
  return useMutation<IChangeUserPasswordResponse, unknown, IChangeUserPasswordPayload>({
    mutationFn: async (payload: IChangeUserPasswordPayload): Promise<IChangeUserPasswordResponse> => {
      await AxiosFetcher<void>({
        url: `/user/change-password/${payload.userId}`,
        method: 'PATCH',
        data: { password: payload.password }
      });
    }
  });
};
