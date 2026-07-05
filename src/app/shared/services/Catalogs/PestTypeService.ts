import { IPestType } from 'src/app/main/catalogs/components/types';
import { AxiosFetcher } from '../../fetcher';

export class PestTypeService {
  static getById(id: string): Promise<IPestType> {
    return AxiosFetcher<IPestType>({
      url: `plague-type/${id}`
    });
  }

  static byQuery(query: string): Promise<IPestType[]> {
    return AxiosFetcher<IPestType[]>({
      url: `plague-type`,
      params: query
    });
  }

  static save(pestType: IPestType): Promise<IPestType> {
    return AxiosFetcher<IPestType>({
      url: `plague-type`,
      method: 'POST',
      data: pestType
    });
  }

  static delete(id: string): Promise<void> {
    return AxiosFetcher<void>({
      url: `plague-type/${id}`,
      method: 'DELETE'
    });
  }
}
