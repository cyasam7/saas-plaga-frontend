import { IServiceType } from 'src/app/main/catalogs/components/types';
import { AxiosFetcher } from '../../fetcher';

export class ServiceTypeService {
  static getById(id: string): Promise<IServiceType> {
    return AxiosFetcher<IServiceType>({
      url: `service-type/${id}`
    });
  }

  static byQuery(query: string): Promise<IServiceType[]> {
    return AxiosFetcher<IServiceType[]>({
      url: `service-type`,
      params: query
    });
  }

  static save(serviceType: IServiceType): Promise<IServiceType> {
    return AxiosFetcher<IServiceType>({
      url: `service-type`,
      method: 'POST',
      data: serviceType
    });
  }

  static delete(id: string): Promise<void> {
    return AxiosFetcher<void>({
      url: `service-type/${id}`,
      method: 'DELETE'
    });
  }
}
