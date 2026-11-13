/** Query keys del dominio de tenants. Todas cuelgan de `tenantKeys.all`. */
export const tenantKeys = {
  all: ['tenants'] as const,
  byUser: (userId: string) => [...tenantKeys.all, 'by-user', userId] as const
};
