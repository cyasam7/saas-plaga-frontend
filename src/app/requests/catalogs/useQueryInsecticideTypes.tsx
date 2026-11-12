import { useQuery } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';
import { catalogKeys } from 'src/app/requests/catalogs/keys';

export type IInsecticideTypesPayload = void;

/** Espejo de `IGetInsecticideTypesByQueryResponse[]` (api/.../type-insecticide/application/GetByQueryTypeInsecticide.ts). */
export type IInsecticideTypesResponse = {
  id: string;
  commercialName: string;
  chemicalName: string;
  description: string;
  doses: {
    amount: string;
    unit: string;
  }[];
  tenantId: string;
}[];

/** `GET /insecticide-type`: productos (insecticidas) del tenant con sus dosis. */
export const useQueryInsecticideTypes = (_payload?: IInsecticideTypesPayload, enabled?: boolean) => {
  return useQuery<IInsecticideTypesResponse>({
    queryKey: catalogKeys.insecticideTypes(),
    queryFn: () => AxiosFetcher<IInsecticideTypesResponse>({ url: '/insecticide-type', method: 'GET' }),
    enabled
  });
};
