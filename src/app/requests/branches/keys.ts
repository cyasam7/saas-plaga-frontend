import { IBranchesPayload } from 'src/app/requests/branches/useQueryBranches';

/**
 * Query keys del dominio de sucursales (ubicaciones de clientes B2B). Todas cuelgan de
 * `branchKeys.all`, así que invalidar `branchKeys.lists()` refresca todos los listados.
 */
export const branchKeys = {
  all: ['branches'] as const,
  lists: () => [...branchKeys.all, 'list'] as const,
  list: (payload: IBranchesPayload) => [...branchKeys.lists(), payload] as const,
  form: (branchId: string) => [...branchKeys.all, 'form', branchId] as const
};
