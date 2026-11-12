import { useMutation } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';

export interface IChangeMembershipIsActivePayload {
  membershipId: string;
  /** Cuerpo: `ChangeIsActiveMembershipDTO` (api/.../membership/infrastructure/MembershipDTO.ts). */
  isActive: boolean;
  tenantId: string;
}

/** `PATCH /membership/is-active/:id` no devuelve cuerpo. */
export type IChangeMembershipIsActiveResponse = void;

/** `PATCH /membership/is-active/:id`: activa o desactiva la membresía. */
export const useMutationChangeMembershipIsActive = () => {
  return useMutation<IChangeMembershipIsActiveResponse, unknown, IChangeMembershipIsActivePayload>({
    mutationFn: async (payload: IChangeMembershipIsActivePayload): Promise<IChangeMembershipIsActiveResponse> => {
      await AxiosFetcher<void>({
        url: `/membership/is-active/${payload.membershipId}`,
        method: 'PATCH',
        data: { isActive: payload.isActive, tenantId: payload.tenantId }
      });
    }
  });
};
