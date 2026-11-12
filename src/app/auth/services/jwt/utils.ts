import { User } from '../../user';
import { IGetCurrentUserResponse, ISignInResponse } from 'src/app/requests/auth/types';

function toTemplateRole(params: string): string {
  const map = {
    RL000: 'admin',
    RL001: 'staff',
    RL002: 'fumigador'
  };

  return map[params] as string;
}

export function formatUserResponse(response: ISignInResponse | IGetCurrentUserResponse): User {
  const user = {
    uid: response.id,
    role: toTemplateRole(response.role.code),
    data: {
      displayName: response.name,
      photoURL: response.name,
      email: response.email,
      tenant: response.tenant,
      // Solo el sign-in lo envía; GET /auth/user no lo incluye.
      isTenantConfigured: 'isTenantConfigured' in response ? response.isTenantConfigured : undefined
    }
  } as User;
  return user;
}
