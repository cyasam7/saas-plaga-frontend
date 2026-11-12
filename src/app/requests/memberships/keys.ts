/** Query keys del dominio de membresías. Todas cuelgan de `membershipKeys.all`. */
export const membershipKeys = {
  all: ['memberships'] as const,
  datagrid: () => [...membershipKeys.all, 'datagrid'] as const
};
