import { Branch, ClientType } from 'src/app/main/clients/types';
import { AxiosFetcher } from '../fetcher';
import { FormBranchValues } from 'src/app/main/clients/Forms/BranchForm/types';

export class BranchService {
  static async getByQuery(query?: { type?: ClientType }): Promise<Branch[]> {
    const data = await AxiosFetcher<Branch[]>({
      url: '/branch',
      method: 'GET',
      params: query ?? {}
    });

    return data;
  }

  static async save(formValues: FormBranchValues): Promise<void> {
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

  static async remove(id: string): Promise<void> {
    await AxiosFetcher({
      url: '/branch/' + id,
      method: 'DELETE'
    });
  }
}
