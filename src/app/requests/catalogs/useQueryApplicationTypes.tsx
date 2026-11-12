import { useQuery } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';
import { INamedCatalogItem } from 'src/app/requests/catalogs/types';
import { catalogKeys } from 'src/app/requests/catalogs/keys';

export type IApplicationTypesPayload = void;

/** Espejo de `IGetApplicationTypesByQueryResponse[]` (api/.../type-application/application/GetByQueryTypeApplication.ts). */
export type IApplicationTypesResponse = INamedCatalogItem[];

/** `GET /application-type`: tipos de aplicación del tenant. */
export const useQueryApplicationTypes = (_payload?: IApplicationTypesPayload, enabled?: boolean) => {
  return useQuery<IApplicationTypesResponse>({
    queryKey: catalogKeys.applicationTypes(),
    queryFn: () => AxiosFetcher<IApplicationTypesResponse>({ url: '/application-type', method: 'GET' }),
    enabled
  });
};
