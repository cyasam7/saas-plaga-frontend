import { useQuery } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';
import { INamedCatalogItem } from 'src/app/requests/catalogs/types';
import { catalogKeys } from 'src/app/requests/catalogs/keys';

export type IServiceTypesPayload = void;

/** Espejo de `IGetServiceTypesByQueryResponse[]` (api/.../type-service/application/GetByQueryTypeService.ts). */
export type IServiceTypesResponse = INamedCatalogItem[];

/** `GET /service-type`: tipos de servicio del tenant. */
export const useQueryServiceTypes = (_payload?: IServiceTypesPayload, enabled?: boolean) => {
  return useQuery<IServiceTypesResponse>({
    queryKey: catalogKeys.serviceTypes(),
    queryFn: () => AxiosFetcher<IServiceTypesResponse>({ url: '/service-type', method: 'GET' }),
    enabled
  });
};
