import { useMutation } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';
import { ISaveNamedCatalogPayload } from 'src/app/requests/catalogs/types';

export type ISavePestTypePayload = ISaveNamedCatalogPayload;

/** `POST /plague-type` no devuelve cuerpo. */
export type ISavePestTypeResponse = void;

/** `POST /plague-type`: crea o (con `id`) actualiza un elemento de tipos de plaga. */
export const useMutationSavePestType = () => {
  return useMutation<ISavePestTypeResponse, unknown, ISavePestTypePayload>({
    mutationFn: async (payload: ISavePestTypePayload): Promise<ISavePestTypeResponse> => {
      await AxiosFetcher<void>({ url: '/plague-type', method: 'POST', data: payload });
    }
  });
};
