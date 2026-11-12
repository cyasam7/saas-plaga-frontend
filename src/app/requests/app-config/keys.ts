/** Query keys del dominio de configuración de la cuenta. Todas cuelgan de `appConfigKeys.all`. */
export const appConfigKeys = {
  all: ['app-config'] as const,
  account: (tenantId: string) => [...appConfigKeys.all, 'account', tenantId] as const
};
