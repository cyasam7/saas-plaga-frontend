/** Query keys del dominio de sucursales del tenant. Todas cuelgan de `companyBranchKeys.all`. */
export const companyBranchKeys = {
  all: ['company-branches'] as const,
  lists: () => [...companyBranchKeys.all, 'list'] as const,
  list: (search: string) => [...companyBranchKeys.lists(), search] as const,
  form: (companyBranchId: string) => [...companyBranchKeys.all, 'form', companyBranchId] as const
};
