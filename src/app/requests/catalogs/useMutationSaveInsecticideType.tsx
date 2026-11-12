import { useMutation } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';

/** Espejo de `CreateTypeInsecticideDTO` (api/.../type-insecticide/infrastructure/TypeInsecticideDto.ts). Con `id` actualiza. */
export interface ISaveInsecticideTypePayload {
  id?: string;
  commercialName: string;
  chemicalName: string;
  description?: string;
  doses: {
    amount: string;
    unit: string;
  }[];
}

/** `POST /insecticide-type` no devuelve cuerpo. */
export type ISaveInsecticideTypeResponse = void;

/** `POST /insecticide-type`: crea o (con `id`) actualiza un producto. */
export const useMutationSaveInsecticideType = () => {
  return useMutation<ISaveInsecticideTypeResponse, unknown, ISaveInsecticideTypePayload>({
    mutationFn: async (payload: ISaveInsecticideTypePayload): Promise<ISaveInsecticideTypeResponse> => {
      await AxiosFetcher<void>({ url: '/insecticide-type', method: 'POST', data: payload });
    }
  });
};
