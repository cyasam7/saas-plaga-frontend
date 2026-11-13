import { useQuery } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';
import { INamedCatalogItem } from 'src/app/requests/catalogs/types';
import { catalogKeys } from 'src/app/requests/catalogs/keys';

export type IPestTypesPayload = void;

/** Espejo de `IGetPlagueTypesByQueryResponse[]` (api/.../type-plague/application/GetByQueryTypePlague.ts). */
export type IPestTypesResponse = INamedCatalogItem[];

/** `GET /plague-type`: tipos de plaga del tenant. */
export const useQueryPestTypes = (_payload?: IPestTypesPayload, enabled?: boolean) => {
  return useQuery<IPestTypesResponse>({
    queryKey: catalogKeys.pestTypes(),
    queryFn: () => AxiosFetcher<IPestTypesResponse>({ url: '/plague-type', method: 'GET' }),
    enabled
  });
};
