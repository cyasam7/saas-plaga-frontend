import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { BrowserRouter } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import SplashScreen from 'app/core/feedback/SplashScreen';
import { TIMEZONE } from 'src/app/shared/constants/dateFormat';
import {
	IApiErrorResponse,
	IGetCurrentUserResponse,
	IRefreshTokenResponse,
	ISignInPayload,
	ISignInResponse,
	ISignUpPayload
} from 'src/app/requests/auth/types';

/** Donde versiones anteriores guardaban los tokens; se borran al cargar para no dejarlos expuestos. */
const LEGACY_TOKEN_STORAGE_KEYS = ['jwt_access_token', 'jwt_refresh_token'];
// Endpoints `auth/web/*`: el API guarda los tokens en cookies httpOnly, que JavaScript no puede leer.
const SIGN_IN_URL = '/auth/web/sign-in';
const TOKEN_REFRESH_URL = '/auth/web/refresh';
const SIGN_OUT_URL = '/auth/web/sign-out';
const SIGN_UP_URL = '/auth/sign-up';
const CURRENT_USER_URL = '/auth/user';

/**
 * The signed-in user, in the shape the layout, navigation and route guards read.
 */
type User = {
	uid: string;
	role: string[] | string | null;
	data: {
		displayName: string;
		photoURL?: string;
		email?: string;
		tenant?: string;
		isTenantConfigured?: boolean;
	};
};

interface AxiosConfigRetry extends InternalAxiosRequestConfig {
	_retry?: boolean;
}

/** The user held while nobody is signed in. */
function createGuestUser(): User {
	return {
		uid: '',
		role: null,
		data: {
			displayName: 'Guest User',
			photoURL: '',
			email: ''
		}
	};
}

function toTemplateRole(roleCode: string): string {
	const templateRoleByCode = {
		RL000: 'admin',
		RL001: 'staff',
		RL002: 'fumigador'
	};

	return templateRoleByCode[roleCode] as string;
}

function formatUserResponse(response: ISignInResponse | IGetCurrentUserResponse): User {
	return {
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
}

/** Los tokens viajan solos en sus cookies; aquí solo quedan los headers que el API pide aparte. */
function setSession(tenant?: string) {
	axios.defaults.headers.common['x-tenant'] = tenant;
	axios.defaults.headers.common['x-timezone'] = TIMEZONE;
	axios.defaults.headers.common['Content-Type'] = 'application/json';
}

function resetSession() {
	delete axios.defaults.headers.common['x-tenant'];
}

type AuthContextValue = {
	user: User;
	isAuthenticated: boolean;
	signIn: (credentials: ISignInPayload) => Promise<AxiosResponse<ISignInResponse>>;
	/** Registers the tenant and its admin. The API returns no session, so the user still has to sign in. */
	signUp: (signUpPayload: ISignUpPayload) => Promise<AxiosResponse<void>>;
	signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthRouteProviderProps = { children: React.ReactNode };

/**
 * Owns the session: the API keeps the JWTs in httpOnly cookies, so this sets the tenant headers,
 * refreshes the session on a 401, restores it on load and exposes the signed-in user.
 */
function AuthRouteProvider({ children }: AuthRouteProviderProps) {
	const queryClient = useQueryClient();
	const [user, setUser] = useState<User>(() => createGuestUser());
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	/**
	 * Starts the session and replaces the user.
	 */
	const handleSignInSuccess = useCallback((signedInUser: User) => {
		setSession(signedInUser.data.tenant);
		setIsAuthenticated(true);
		setUser(signedInUser);
	}, []);

	const handleSignInFailure = useCallback((error: AxiosError) => {
		resetSession();
		setIsAuthenticated(false);
		// eslint-disable-next-line no-console
		console.warn(error);
	}, []);

	const signIn = useCallback(
		(credentials: ISignInPayload) => {
			const signInRequest = axios.post<ISignInResponse>(SIGN_IN_URL, credentials);

			signInRequest.then(
				(signInResponse) => handleSignInSuccess(formatUserResponse(signInResponse.data)),
				(error) => handleSignInFailure(error as AxiosError)
			);

			return signInRequest;
		},
		[handleSignInSuccess, handleSignInFailure]
	);

	const signUp = useCallback(
		(signUpPayload: ISignUpPayload) => axios.post<void>(SIGN_UP_URL, signUpPayload),
		[]
	);

	const signOut = useCallback(() => {
		// Las cookies son httpOnly: solo el API puede borrarlas. Si falla, la sesión local se cierra igual.
		axios.post<void>(SIGN_OUT_URL).catch(() => undefined);
		resetSession();
		setIsAuthenticated(false);
		queryClient.removeQueries();
		setUser(createGuestUser());
	}, [queryClient]);

	/** Renueva las cookies de sesión con la cookie del refresh token. */
	const refreshSession = useCallback(async (): Promise<boolean> => {
		try {
			const { data: refreshTokenResponse } = await axios.post<IRefreshTokenResponse>(TOKEN_REFRESH_URL);

			setSession(refreshTokenResponse.tenant);
			return true;
		} catch {
			signOut();
			return false;
		}
	}, [signOut]);

	/**
	 * On a 401, refreshes the session once and retries the request (the browser sends the new cookies).
	 * Registered once; the cleanup ejects it so it never stacks up.
	 */
	useEffect(() => {
		const responseInterceptorId = axios.interceptors.response.use(
			(response) => response,
			async (error) => {
				const axiosError = error as AxiosError<IApiErrorResponse>;
				// No `response` on network errors or timeouts: pass those through untouched.
				const statusError = axiosError.response?.status;
				const originalRequest = axiosError.config as AxiosConfigRetry;
				const isAuthRequest = [TOKEN_REFRESH_URL, SIGN_IN_URL, SIGN_OUT_URL].some((authUrl) =>
					originalRequest?.url?.includes(authUrl)
				);

				if (statusError === 401 && !isAuthRequest && !originalRequest._retry) {
					originalRequest._retry = true;
					const isSessionRefreshed = await refreshSession();
					if (!isSessionRefreshed) {
						return Promise.reject(axiosError);
					}

					// Se reenvía la config original: conserva params, body y headers como x-timezone.
					return axios(originalRequest);
				}

				return Promise.reject(axiosError);
			}
		);

		return () => {
			axios.interceptors.response.eject(responseInterceptorId);
		};
	}, [refreshSession]);

	/**
	 * On page load, restores the session from the cookies: if `GET /auth/user` succeeds the
	 * user is signed in. Runs once; sign-in and sign-out update the session themselves.
	 */
	useEffect(() => {
		const attemptAutoLogin = async () => {
			LEGACY_TOKEN_STORAGE_KEYS.forEach((legacyStorageKey) => localStorage.removeItem(legacyStorageKey));
			try {
				setIsLoading(true);
				const { data: currentUserResponse } = await axios.get<IGetCurrentUserResponse>(CURRENT_USER_URL);
				handleSignInSuccess(formatUserResponse(currentUserResponse));
			} catch {
				// No valid session: stay signed out.
			}
		};

		attemptAutoLogin().then(() => {
			setIsLoading(false);
		});
	}, [handleSignInSuccess]);

	const authContextValue = useMemo<AuthContextValue>(
		() => ({ user, isAuthenticated, signIn, signUp, signOut }),
		[user, isAuthenticated, signIn, signUp, signOut]
	);

	if (isLoading) {
		return <SplashScreen />;
	}

	return (
		<AuthContext.Provider value={authContextValue}>
			<BrowserRouter>{children}</BrowserRouter>
		</AuthContext.Provider>
	);
}

function useAuth(): AuthContextValue {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within a AuthRouteProvider');
	}
	return context;
}

export { useAuth, AuthRouteProvider };
