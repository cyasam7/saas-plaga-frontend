import { useMutation } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';
import { ISaveNamedCatalogPayload } from 'src/app/requests/catalogs/types';

export type ISaveServiceTypePayload = ISaveNamedCatalogPayload;

/** `POST /service-type` no devuelve cuerpo. */
export type ISaveServiceTypeResponse = void;

/** `POST /service-type`: crea o (con `id`) actualiza un elemento de tipos de servicio. */
export const useMutationSaveServiceType = () => {
  return useMutation<ISaveServiceTypeResponse, unknown, ISaveServiceTypePayload>({
    mutationFn: async (payload: ISaveServiceTypePayload): Promise<ISaveServiceTypeResponse> => {
      await AxiosFetcher<void>({ url: '/service-type', method: 'POST', data: payload });
    }
  });
};
