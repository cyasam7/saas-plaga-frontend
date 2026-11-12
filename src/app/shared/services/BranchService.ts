import { Branch, ClientType, IBranchForm, IGetBranchFormResponse } from 'src/app/main/clients/types';
import { AxiosFetcher } from '../fetcher';

/** Alta rápida sin áreas (POST /branch); la usa el formulario de órdenes. */
interface ISaveBranchPayload {
  id?: string;
  clientId: string;
  name: string;
  address: string;
  contactPhone: string;
  contactPerson?: string;
  notes?: string;
}

/** Respuesta de POST /branch/form. */
interface ICreateBranchFormResponse {
  id: string;
}

export class BranchService {
  static async getByQuery(query?: { type?: ClientType }): Promise<Branch[]> {
    const data = await AxiosFetcher<Branch[]>({
      url: '/branch',
      method: 'GET',
      params: query ?? {}
    });

    return data;
  }

  static async save(formValues: ISaveBranchPayload): Promise<void> {
    await AxiosFetcher<Branch[]>({
      url: '/branch',
      method: 'POST',
      data: {
        ...formValues
      }
    });
  }

  static async byId(id: string): Promise<Branch> {
    return await AxiosFetcher<Branch>({
      url: `/branch/${id}`,
      method: 'GET'
    });
  }

  static async byQuery(query: { clientId?: string }): Promise<Branch[]> {
    return await AxiosFetcher<Branch[]>({
      url: `/branch`,
      method: 'GET',
      params: query
    });
  }

  static async getForm(id: string): Promise<IGetBranchFormResponse> {
    return await AxiosFetcher<IGetBranchFormResponse>({
      url: `/branch/${id}/form`,
      method: 'GET'
    });
  }

  static async createForm(clientId: string, form: IBranchForm): Promise<ICreateBranchFormResponse> {
    return await AxiosFetcher<ICreateBranchFormResponse>({
      url: '/branch/form',
      method: 'POST',
      data: { clientId, form }
    });
  }

  static async updateForm(id: string, form: IBranchForm): Promise<void> {
    await AxiosFetcher<void>({
      url: `/branch/${id}`,
      method: 'PUT',
      data: form
    });
  }

  static async remove(id: string): Promise<void> {
    await AxiosFetcher({
      url: '/branch/' + id,
      method: 'DELETE'
    });
  }
}
