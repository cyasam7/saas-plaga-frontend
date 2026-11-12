/** Query keys del dominio de usuarios. Todas cuelgan de `userKeys.all`. */
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  datagrid: (userId: string) => [...userKeys.lists(), 'datagrid', userId] as const,
  detail: (userId: string) => [...userKeys.all, 'detail', userId] as const
};
