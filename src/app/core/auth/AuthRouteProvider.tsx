import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { BrowserRouter } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import _ from '@lodash';
import SplashScreen from 'app/core/feedback/SplashScreen';
import { TIMEZONE } from 'src/app/shared/constants/dateFormat';
import {
	IApiErrorResponse,
	IGetCurrentUserResponse,
	IRefreshTokenPayload,
	IRefreshTokenResponse,
	ISignInPayload,
	ISignInResponse,
	ISignUpPayload
} from 'src/app/requests/auth/types';

const ACCESS_TOKEN_STORAGE_KEY = 'jwt_access_token';
const REFRESH_TOKEN_STORAGE_KEY = 'jwt_refresh_token';
const SIGN_IN_URL = '/auth/sign-in';
const SIGN_UP_URL = '/auth/sign-up';
const TOKEN_REFRESH_URL = '/auth/refresh';
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

function setSession(accessToken: string, refreshToken: string, tenant?: string) {
	localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
	localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
	axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
	axios.defaults.headers.common['x-tenant'] = tenant;
	axios.defaults.headers.common['x-timezone'] = TIMEZONE;
	axios.defaults.headers.common['Content-Type'] = 'application/json';
}

function resetSession() {
	localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
	localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
	delete axios.defaults.headers.common.Authorization;
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
 * Owns the JWT session: stores the tokens, sets the axios auth/tenant headers, refreshes the
 * access token on a 401, restores the session on load and exposes the signed-in user.
 */
function AuthRouteProvider({ children }: AuthRouteProviderProps) {
	const queryClient = useQueryClient();
	const [user, setUser] = useState<User>(() => createGuestUser());
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	/**
	 * Starts the session and replaces the user, keeping fields the new user doesn't define.
	 */
	const handleSignInSuccess = useCallback((signedInUser: User, accessToken: string, refreshToken: string) => {
		setSession(accessToken, refreshToken, signedInUser.data.tenant);
		setIsAuthenticated(true);
		setUser((currentUser) => _.defaults({}, signedInUser, currentUser));
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
				(signInResponse) => {
					const { accessToken, refreshToken } = signInResponse.data;
					handleSignInSuccess(formatUserResponse(signInResponse.data), accessToken, refreshToken);
				},
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
		resetSession();
		setIsAuthenticated(false);
		queryClient.removeQueries();
		setUser(createGuestUser());
	}, [queryClient]);

	const refreshAccessToken = useCallback(async (): Promise<string | null> => {
		try {
			const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
			const refreshTokenPayload: IRefreshTokenPayload = { refreshToken: storedRefreshToken };
			const { data: refreshTokenResponse } = await axios.post<IRefreshTokenResponse>(
				TOKEN_REFRESH_URL,
				refreshTokenPayload
			);

			setSession(refreshTokenResponse.accessToken, storedRefreshToken, refreshTokenResponse.user.tenant);
			return refreshTokenResponse.accessToken;
		} catch {
			signOut();
			return null;
		}
	}, [signOut]);

	/**
	 * Sends the stored access token on every request and, on a 401, refreshes it once and retries.
	 * Registered once; the cleanup ejects them so they never stack up.
	 */
	useEffect(() => {
		const requestInterceptorId = axios.interceptors.request.use(async (requestConfig) => {
			const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

			if (accessToken) {
				requestConfig.headers.Authorization = `Bearer ${accessToken}`;
			}
			return requestConfig;
		});
		const responseInterceptorId = axios.interceptors.response.use(
			(response) => response,
			async (error) => {
				const axiosError = error as AxiosError<IApiErrorResponse>;
				// No `response` on network errors or timeouts: pass those through untouched.
				const statusError = axiosError.response?.status;
				const originalRequest = axiosError.config as AxiosConfigRetry;
				const isAuthRequest =
					originalRequest?.url?.includes(TOKEN_REFRESH_URL) || originalRequest?.url?.includes(SIGN_IN_URL);

				if (statusError === 401 && !isAuthRequest && !originalRequest._retry) {
					// Lock the token refresh process to avoid multiple simultaneous requests
					originalRequest._retry = true;
					const updatedAccessToken = await refreshAccessToken();
					if (!updatedAccessToken) {
						signOut();
						return Promise.reject(axiosError);
					}
					const retryRequestConfig: AxiosRequestConfig = {
						url: originalRequest.url,
						method: originalRequest.method,
						headers: {
							...originalRequest.headers,
							Authorization: `Bearer ${updatedAccessToken}`,
							'Content-Type': 'application/json',
							Accept: 'application/json'
						}
					};

					if (originalRequest.data) {
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
						retryRequestConfig.data = JSON.parse(originalRequest.data);
					}

					return Promise.resolve(axios(retryRequestConfig));
				}

				return Promise.reject(axiosError);
			}
		);

		return () => {
			axios.interceptors.request.eject(requestInterceptorId);
			axios.interceptors.response.eject(responseInterceptorId);
		};
	}, [refreshAccessToken, signOut]);

	/**
	 * On page load, restores the session from the stored token: if `GET /auth/user` succeeds the
	 * user is signed in. Runs once; sign-in and sign-out update the session themselves.
	 */
	useEffect(() => {
		const attemptAutoLogin = async () => {
			try {
				setIsLoading(true);
				const { data: currentUserResponse } = await axios.get<IGetCurrentUserResponse>(CURRENT_USER_URL);
				handleSignInSuccess(
					formatUserResponse(currentUserResponse),
					currentUserResponse.accessToken,
					currentUserResponse.refreshToken
				);
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
