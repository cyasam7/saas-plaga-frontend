import { IProduct } from 'src/app/main/catalogs/components/types';
import { AxiosFetcher } from '../../fetcher';

export class InsecticideTypeService {
  static getById(id: string): Promise<IProduct> {
    return AxiosFetcher<IProduct>({
      url: `insecticide-type/${id}`
    });
  }

  static byQuery(query: string): Promise<IProduct[]> {
    return AxiosFetcher<IProduct[]>({
      url: `insecticide-type`,
      params: query
    });
  }

  static save(product: IProduct): Promise<IProduct> {
    return AxiosFetcher<IProduct>({
      url: `insecticide-type`,
      method: 'POST',
      data: product
    });
  }

  static delete(id: string): Promise<void> {
    return AxiosFetcher<void>({
      url: `insecticide-type/${id}`,
      method: 'DELETE'
    });
  }
}
