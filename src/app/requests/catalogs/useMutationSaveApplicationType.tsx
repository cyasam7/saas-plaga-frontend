import { useMutation } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';
import { ISaveNamedCatalogPayload } from 'src/app/requests/catalogs/types';

export type ISaveApplicationTypePayload = ISaveNamedCatalogPayload;

/** `POST /application-type` no devuelve cuerpo. */
export type ISaveApplicationTypeResponse = void;

/** `POST /application-type`: crea o (con `id`) actualiza un elemento de tipos de aplicación. */
export const useMutationSaveApplicationType = () => {
  return useMutation<ISaveApplicationTypeResponse, unknown, ISaveApplicationTypePayload>({
    mutationFn: async (payload: ISaveApplicationTypePayload): Promise<ISaveApplicationTypeResponse> => {
      await AxiosFetcher<void>({ url: '/application-type', method: 'POST', data: payload });
    }
  });
};
