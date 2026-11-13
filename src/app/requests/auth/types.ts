import { ERoleCode } from 'src/app/requests/users/types';

/**
 * Endpoints de sesión. Los llama `core/auth/AuthRouteProvider.tsx` y su
 * interceptor fuera de React Query, así que solo sus tipos viven aquí.
 */

/** Cuerpo de `POST /auth/sign-in` (`LoginAuthDTO`). */
export interface ISignInPayload {
  email: string;
  password: string;
}

/** Espejo de `ILoginAuthResponse` (api/.../_shared/auth/application/LoginAuth.ts). */
export interface ISignInResponse {
  id: string;
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  role: {
    id: string;
    name: string;
    code: ERoleCode;
  };
  tenant: string;
  /** Solo aplica al admin del tenant; `null` para cualquier otro rol. */
  isTenantConfigured: boolean | null;
}

/** Cuerpo de `POST /auth/sign-up` (`CreateUserTenantDTO`). No devuelve cuerpo. */
export interface ISignUpPayload {
  name: string;
  phone: string;
  email: string;
  password: string;
  workspaceName: string;
  companyName: string;
}

/** Cuerpo de `POST /auth/refresh` (`RefreshTokenDTO`). */
export interface IRefreshTokenPayload {
  refreshToken: string;
}

/** Espejo de `IRefreshUserTokenResponse` (api/.../_shared/auth/application/RefreshTokenAuth.ts). */
export interface IRefreshTokenResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    role: {
      id: string;
      name: string;
      code: ERoleCode;
    };
    tenant: string;
  };
}

/** Espejo de `IGetCurrentUserResponse` (api/.../_shared/auth/application/GetCurrentUserAuth.ts). */
export interface IGetCurrentUserResponse {
  id: string;
  name: string;
  email: string;
  accessToken?: string;
  refreshToken?: string;
  role: {
    id: string;
    name: string;
    code: string;
  };
  tenant?: string;
}

/** Cuerpo de error que devuelve el API (`HttpExceptionFilter`); lo lee el interceptor de `AuthRouteProvider`. */
export interface IApiErrorResponse {
  statusCode: number;
  message: string;
}
