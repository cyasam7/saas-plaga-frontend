import { useMutation } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';
import { EMembershipType } from 'src/app/requests/memberships/types';

/** Espejo de `SaveMembershipDTO` (api/.../membership/infrastructure/MembershipDTO.ts). */
export interface ICreateMembershipPayload {
  name: string;
  phone: string;
  email: string;
  password: string;
  workspaceName: string;
  companyName: string;
  membershipType: EMembershipType;
  /** ISO. */
  dueDate: string;
}

/** `POST /membership` no devuelve cuerpo. */
export type ICreateMembershipResponse = void;

/** `POST /membership`: crea el tenant, su usuario dueño y la membresía. */
export const useMutationCreateMembership = () => {
  return useMutation<ICreateMembershipResponse, unknown, ICreateMembershipPayload>({
    mutationFn: async (payload: ICreateMembershipPayload): Promise<ICreateMembershipResponse> => {
      await AxiosFetcher<void>({ url: '/membership', method: 'POST', data: payload });
    }
  });
};
