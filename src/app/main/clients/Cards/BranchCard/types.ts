import { IBranchesResponse } from "src/app/requests/branches/useQueryBranches"

export interface BranchCardProps {
  branch: IBranchesResponse[number]
  onMenuClick: (event: React.MouseEvent<HTMLElement>, branchId: string) => void
}
