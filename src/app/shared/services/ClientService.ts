import { Client, ClientType } from "src/app/main/clients/types";
import { AxiosFetcher } from "../fetcher";
import { FormClientValues } from "src/app/main/clients/Forms/NewClientForm/types";
import { ClientOrderHistoryResponse } from "../entities/ClientOrderHistory";


export class ClientService {

  static async getByQuery(query?: { type?: ClientType }): Promise<Client[]> {
    const data = await AxiosFetcher<Client[]>({
      url: "/clients",
      method: "GET",
      params: query ?? {}
    })

    return data
  }


  static async save(formValues: FormClientValues, id?: string): Promise<void> {
    await AxiosFetcher<Client[]>({
      url: "/clients",
      method: "POST",
      data: {
        ...formValues,
        ...(id ? { id } : {}),
      }
    })
  }

  static async byId(id: string): Promise<Client> {
    return await AxiosFetcher<Client>({
      url: `/clients/${id}`,
      method: "GET",
    })
  }

  static async getOrdersHistory(clientId: string): Promise<ClientOrderHistoryResponse[]> {
    return await AxiosFetcher<ClientOrderHistoryResponse[]>({
      url: `/clients/${clientId}/orders`,
      method: "GET",
    })
  }

  static async remove(id: string): Promise<void> {
    await AxiosFetcher<Client[]>({
      url: "/clients/" + id,
      method: "DELETE",
    })
  }
}
