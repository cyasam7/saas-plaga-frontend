import axios from 'axios';
import { DatagridRowOrder, EClientType, EStatusOrder, IUserValidToStartOrder, OrderEntity } from '../entities/OrderEntity';
import { AxiosFetcher } from '../fetcher';
import { ResponseId } from '../entities/UserEntity';

export interface IQueryOrder {
  clientId?: string;
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

  static async updateStatus(id: string, status: EStatusOrder): Promise<void> {
    await AxiosFetcher({
      url: `/order/status/${id}`,
      method: 'PATCH',
      data: {
        status
      }
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

  static async getDatagridOrders(): Promise<DatagridRowOrder[]> {
    const data = await AxiosFetcher<DatagridRowOrder[]>({
      url: `/order/datagrid`,
      method: 'GET'
    });
    return data;
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
