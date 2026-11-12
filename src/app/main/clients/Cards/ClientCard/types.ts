import { IClient } from "src/app/requests/clients/types"

export interface ClientCardProps {
  client: IClient
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, id: string) => void
} 