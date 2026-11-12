import { useMutation } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';
import { ClientType, IBusinessDetails, PropertyType, TaxpayerType } from 'src/app/requests/clients/types';

/**
 * Espejo de `CreateClientDTO` (api/.../client/infrastructure/ClientDto.ts). Con `id` actualiza.
 * En clientes B2B `locations` reemplaza las ubicaciones/áreas existentes (las que no vienen se eliminan).
 */
export interface ISaveClientPayload {
  id?: string;
  name: string;
  type: ClientType;
  email?: string;
  phone?: string;
  address?: string;
  legalName?: string;
  taxpayerType?: TaxpayerType;
  rfc?: string;
  businessActivity?: string;
  requiresCompliance?: boolean;
  locations?: {
    id?: string;
    name: string;
    address: string;
    contactPhone: string;
    contactPerson?: string;
    references?: string;
    areas?: {
      id?: string;
      name: string;
      description?: string;
    }[];
  }[];
  ownerName?: string;
  propertyType?: PropertyType;
  businessDetails?: IBusinessDetails;
}

/** `POST /clients` no devuelve cuerpo. */
export type ISaveClientResponse = void;

/** `POST /clients`: crea o actualiza (con `id`) un cliente. */
export const useMutationSaveClient = () => {
  return useMutation<ISaveClientResponse, unknown, ISaveClientPayload>({
    mutationFn: async (payload: ISaveClientPayload): Promise<ISaveClientResponse> => {
      await AxiosFetcher<void>({ url: '/clients', method: 'POST', data: payload });
    }
  });
};
