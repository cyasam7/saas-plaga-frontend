import { FormClientValues } from "../../Forms/NewClientForm/types";
import { Client } from "../../types";

export interface ClientListProps {
  clients: Client[]
  onSaveClient?: (data: FormClientValues, id?: string) => Promise<void>
  onDeleteClient?: (id: string) => void
} 