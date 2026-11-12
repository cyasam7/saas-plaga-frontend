/** Query keys del dominio de catálogos. Todas cuelgan de `catalogKeys.all`. */
export const catalogKeys = {
  all: ['catalogs'] as const,
  pestTypes: () => [...catalogKeys.all, 'pest-types'] as const,
  serviceTypes: () => [...catalogKeys.all, 'service-types'] as const,
  applicationTypes: () => [...catalogKeys.all, 'application-types'] as const,
  insecticideTypes: () => [...catalogKeys.all, 'insecticide-types'] as const
};
