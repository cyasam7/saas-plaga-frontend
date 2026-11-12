import { FormClientValues } from "../../Forms/NewClientForm/types";
import { IClientsResponse } from "src/app/requests/clients/useQueryClients";

export interface ClientListProps {
  clients: IClientsResponse
  onSaveClient?: (data: FormClientValues, id?: string) => Promise<void>
  onDeleteClient?: (id: string) => void
} 