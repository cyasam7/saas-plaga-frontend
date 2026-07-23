import axios from 'axios';
import { DatagridRowOrder, EClientType, EStatusOrder, IUserValidToStartOrder, OrderEntity } from '../entities/OrderEntity';
import { AxiosFetcher } from '../fetcher';
import { ResponseId } from '../entities/UserEntity';
import { Paginated } from 'src/app/shared-interfaces/Paginated';

export interface IQueryOrder {
  clientId?: string;
}

export enum EOrdersDayFilter {
  ALL = 'all',
  TODAY = 'today',
  TOMORROW = 'tomorrow',
  PENDING = 'pending'
}

export interface IQueryDatagridOrders {
  dayFilter?: EOrdersDayFilter;
  date?: string;
}

export interface OrdersDatagridStats {
  total: number;
  today: number;
  pending: number;
}

/** Respuesta de GET /order/datagrid: filas (creadas + asignadas) + resumen. */
export interface GetDatagridOrdersResponse {
  orders: DatagridRowOrder[];
  stats: OrdersDatagridStats;
}

/** Fila de GET /order/history. Espejo del contrato dedicado del endpoint en el API. */
export interface OrderHistoryRow {
  id: string;
  folio: string;
  date: Date;
  timezone: string;
  status: EStatusOrder;
  price: number;
  clientName: string;
  clientType: EClientType | null;
  fumigatorName: string | null;
}

export interface IQueryOrdersHistory {
  page: number;
  take: number;
  status?: EStatusOrder[];
  clientType?: EClientType;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface IClientDataByPhone {
  clientId: string;
  clientName: string;
  clientAddress: string;
  clientType: EClientType;
}

export class OrderService {
  static async getAll(query?: IQueryOrder): Promise<OrderEntity[]> {
    return await AxiosFetcher<OrderEntity[]>({
      url: '/order',
      params: query ?? {},
      method: 'GET'
    });
  }

  /** Updates an existing order (requires id). */
  static async updateOrder(data: any): Promise<ResponseId> {
    return await AxiosFetcher<ResponseId>({
      url: '/order',
      data,
      method: 'POST'
    });
  }

  /** Creates a residential (individual) order, upserting the client by phone/id. */
  static async createIndividualOrder(data: any): Promise<ResponseId> {
    return await AxiosFetcher<ResponseId>({
      url: '/order/individual',
      data,
      method: 'POST'
    });
  }

  /**
   * Creates a business order. With clientId it links the existing client + selected
   * location; without it, creates the client and its location.
   */
  static async createBusinessOrder(data: any): Promise<ResponseId> {
    return await AxiosFetcher<ResponseId>({
      url: '/order/business',
      data,
      method: 'POST'
    });
  }

  static async createFollowingOrder(data: { id: string; description: string; date: Date }): Promise<void> {
    await AxiosFetcher<ResponseId>({
      url: '/order/followUp',
      data,
      method: 'POST'
    });
  }

  static async getById(id: string): Promise<OrderEntity> {
    return await AxiosFetcher<OrderEntity>({
      url: `/order/${id}`,
      method: 'GET'
    });
  }

  static async updateOrderAssigned(data: { orderId: string; userId: string }): Promise<void> {
    await AxiosFetcher({
      url: `/order/assign-user/${data.orderId}`,
      method: 'PATCH',
      data: {
        userId: data.userId
      }
    });
  }

  static async getDatagridOrders(query?: IQueryDatagridOrders): Promise<GetDatagridOrdersResponse> {
    const data = await AxiosFetcher<GetDatagridOrdersResponse>({
      url: `/order/datagrid`,
      method: 'GET',
      params: query ?? {}
    });
    return data;
  }

  static async getOrdersHistory(query: IQueryOrdersHistory): Promise<Paginated<OrderHistoryRow>> {
    const { status, ...rest } = query;
    return await AxiosFetcher<Paginated<OrderHistoryRow>>({
      url: `/order/history`,
      method: 'GET',
      params: {
        ...rest,
        // El API espera los estatus como lista separada por coma.
        ...(status?.length ? { status: status.join(',') } : {})
      }
    });
  }

  static async deleteById(id: string): Promise<void> {
    await AxiosFetcher<DatagridRowOrder[]>({
      url: `/order/${id}`,
      method: 'DELETE'
    });
  }

  static async downloadCertificate({ daysValid, id }: { id: string; daysValid: number }): Promise<void> {
    try {
      const response = await AxiosFetcher({
        url: `/order/certificate/${id}`,
        params: {
          daysValid
        },
        method: 'GET',
        responseType: 'blob'
      });
      const blob = response as Blob;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${id}.pdf`;
      document.body.appendChild(a);
      a.click();
    } catch (error) {
      console.log(error);
    }
  }

  static async downloadServicesOrder(orderId: string): Promise<void> {
    try {
      const response = await AxiosFetcher({
        url: `/order/fumigation-report/${orderId}`,
        method: 'GET',
        responseType: 'blob'
      });
      const blob = response as Blob;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
    } catch (error) {
      console.log(error);
    }
  }

  static async getClientInfoByPhone(phone: string): Promise<IClientDataByPhone | null> {
    try {
      const response = await AxiosFetcher<IClientDataByPhone | null>({
        url: `/order/get-client-data/${phone}`,
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async getFumigatorToAssignOrder(): Promise<IUserValidToStartOrder[]> {
    const resp = await AxiosFetcher<IUserValidToStartOrder[]>({
      url: `/order/fumigators-to-assign-order`,
      method: 'GET'
    });
    return resp;
  }
}
