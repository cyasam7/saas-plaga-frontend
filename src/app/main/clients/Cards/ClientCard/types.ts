import { Client } from "../../types"

export interface ClientCardProps {
  client: Client
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, id: string) => void
} 