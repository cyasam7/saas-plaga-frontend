import { useMutation } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';

export interface IExtendMembershipDueDatePayload {
  membershipId: string;
  /** Cuerpo: `ExtendDueDateMembershipDTO` (api/.../membership/infrastructure/MembershipDTO.ts). ISO. */
  dueDate: string;
  tenantId: string;
}

/** `PATCH /membership/extend-due-date/:id` no devuelve cuerpo. */
export type IExtendMembershipDueDateResponse = void;

/** `PATCH /membership/extend-due-date/:id`: cambia la fecha de vencimiento de la membresía. */
export const useMutationExtendMembershipDueDate = () => {
  return useMutation<IExtendMembershipDueDateResponse, unknown, IExtendMembershipDueDatePayload>({
    mutationFn: async (payload: IExtendMembershipDueDatePayload): Promise<IExtendMembershipDueDateResponse> => {
      await AxiosFetcher<void>({
        url: `/membership/extend-due-date/${payload.membershipId}`,
        method: 'PATCH',
        data: { dueDate: payload.dueDate, tenantId: payload.tenantId }
      });
    }
  });
};
