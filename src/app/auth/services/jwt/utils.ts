import { User, UserLoginResponse } from '../../user';

function toTemplateRole(params: string): string {
  const map = {
    RL000: 'admin',
    RL001: 'staff',
    RL002: 'fumigador'
  };

  return map[params] as string;
}

export function formatUserResponse(response: UserLoginResponse): User {
  const user = {
    uid: response.id,
    role: toTemplateRole(response.role.code),
    data: {
      displayName: response.name,
      photoURL: response.name,
      email: response.email,
      tenant: response.tenant,
      isTenantConfigured: response.isTenantConfigured
    }
  } as User;
  return user;
}
