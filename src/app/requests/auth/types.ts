import { ERoleCode } from 'src/app/requests/users/types';

/**
 * Endpoints de sesión. Los llama `core/auth/AuthRouteProvider.tsx` y su
 * interceptor fuera de React Query, así que solo sus tipos viven aquí.
 * El web usa los endpoints `auth/web/*`: los tokens viajan en cookies httpOnly
 * que pone el API, nunca en el body ni en JavaScript.
 */

/** Cuerpo de `POST /auth/web/sign-in` (`LoginAuthDTO`). */
export interface ISignInPayload {
  email: string;
  password: string;
}

/** Espejo de `IWebSignInResponse` (api/.../_shared/auth/infrastructure/AuthController.ts). */
export interface ISignInResponse {
  id: string;
  name: string;
  email: string;
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

/** Espejo de `IWebRefreshResponse` (api/.../_shared/auth/infrastructure/AuthController.ts). Sin cuerpo: el refresh token va en su cookie. */
export interface IRefreshTokenResponse {
  id: string;
  name: string;
  email: string;
  role: {
    id: string;
    name: string;
    code: ERoleCode;
  };
  tenant: string;
}

/** Espejo de `IGetCurrentUserResponse` (api/.../_shared/auth/application/GetCurrentUserAuth.ts). */
export interface IGetCurrentUserResponse {
  id: string;
  name: string;
  email: string;
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
