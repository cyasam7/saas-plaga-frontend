import { Branch } from "../../types"

export interface BranchCardProps {
  branch: Branch
  onMenuClick: (event: React.MouseEvent<HTMLElement>, branchId: string) => void
}
