import { useMutation } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';

/**
 * `multipart/form-data` con los campos de `SaveAccountConfig` (name, address, primaryColor,
 * secondaryColor, licenseSanitary) y el archivo `logo`. El llamador arma el `FormData`.
 */
export interface ISaveAccountConfigPayload {
  formData: FormData;
}

/** `POST /app-config/account` no devuelve cuerpo. */
export type ISaveAccountConfigResponse = void;

/** `POST /app-config/account`: guarda los datos de la empresa y el logo. */
export const useMutationSaveAccountConfig = () => {
  return useMutation<ISaveAccountConfigResponse, unknown, ISaveAccountConfigPayload>({
    mutationFn: async (payload: ISaveAccountConfigPayload): Promise<ISaveAccountConfigResponse> => {
      await AxiosFetcher<void>({
        url: '/app-config/account',
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        data: payload.formData
      });
    }
  });
};
