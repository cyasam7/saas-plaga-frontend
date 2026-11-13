import { useMutation } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';

/**
 * `multipart/form-data` con los campos de `CreateUserSignDTO` (`userId`) y el archivo `file`.
 * El llamador arma el `FormData`.
 */
export interface ISaveUserSignPayload {
  formData: FormData;
}

/** `POST /user/sign` no devuelve cuerpo. */
export type ISaveUserSignResponse = void;

/** `POST /user/sign`: guarda la firma del usuario. */
export const useMutationSaveUserSign = () => {
  return useMutation<ISaveUserSignResponse, unknown, ISaveUserSignPayload>({
    mutationFn: async (payload: ISaveUserSignPayload): Promise<ISaveUserSignResponse> => {
      await AxiosFetcher<void>({
        url: '/user/sign',
        method: 'POST',
        data: payload.formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
  });
};
