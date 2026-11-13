import { IClientsPayload } from 'src/app/requests/clients/useQueryClients';

/**
 * Query keys del dominio de clientes. Todas cuelgan de `clientKeys.all`, así que invalidar un
 * prefijo (p. ej. `clientKeys.lists()`) alcanza a todas sus variantes.
 */
export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  list: (payload: IClientsPayload) => [...clientKeys.lists(), payload] as const,
  detail: (clientId: string) => [...clientKeys.all, 'detail', clientId] as const,
  ordersHistory: (clientId: string) => [...clientKeys.detail(clientId), 'orders'] as const
};
