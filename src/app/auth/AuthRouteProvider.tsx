import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ISignInPayload, ISignUpPayload } from 'src/app/requests/auth/types';
import { BrowserRouter } from 'react-router-dom';
import SplashScreen from 'app/core/feedback/SplashScreen';
import { PartialDeep } from 'type-fest';
import _ from '@lodash';
import { useQueryClient } from 'react-query';
import useJwtAuth, { JwtAuth } from './services/jwt/useJwtAuth';
import { User } from './user';
import UserModel from './user/models/UserModel';

// Cuerpos de POST /auth/sign-in y /auth/sign-up: viven en `src/app/requests/auth/types.ts`.
export type SignInPayload = ISignInPayload;

export type SignUpPayload = ISignUpPayload;

type AuthContext = {
	user: User;
	jwtService: JwtAuth<User, SignInPayload, SignUpPayload>;
	signOut: () => void;
	isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContext | null>(null);

type AuthProviderProps = { children: React.ReactNode };

function AuthRouteProvider(props: AuthProviderProps) {
	const { children } = props;
	const queryClient = useQueryClient();
	const [user, setUser] = useState<User>(() => UserModel({}));

	/**
	 * Replaces the logged-in user, keeping fields the new user doesn't define.
	 */
	const replaceUser = useCallback((signedInUser: User) => {
		setUser((currentUser) => _.defaults({}, signedInUser, currentUser));
	}, []);

	const resetUser = useCallback(() => {
		setUser(UserModel({}));
	}, []);

	const mergeUser = useCallback((userChanges: PartialDeep<User>) => {
		setUser((currentUser) => _.merge({}, currentUser, userChanges));
	}, []);

	/**
	 * Jwt auth service
	 */
	const jwtService = useJwtAuth({
		config: {
			tokenStorageKey: 'jwt_access_token',
			signInUrl: '/auth/sign-in',
			signUpUrl: '/auth/sign-up',
			tokenRefreshUrl: '/auth/refresh',
			getUserUrl: '/auth/user',
			updateUserUrl: '/auth/user',
			updateTokenFromHeader: true
		},
		onSignedIn: (user: User) => {
			replaceUser(user);
		},
		onSignedUp: (user: User) => {
			replaceUser(user);
		},
		onSignedOut: () => {
			queryClient.removeQueries();

			resetUser();
		},
		onUpdateUser: (user) => {
			mergeUser(user);
		},
		onError: (error) => {
			// eslint-disable-next-line no-console
			console.warn(error);
		}
	});

	const authContextValue = useMemo<AuthContext>(
		() => ({
			user,
			jwtService,
			signOut: jwtService.signOut,
			isAuthenticated: jwtService.isAuthenticated
		}),
		[user, jwtService]
	);

	/**
	 * Render loading screen while loading user data
	 */
	if (jwtService.isLoading) {
		return <SplashScreen />;
	}

	return (
		<AuthContext.Provider value={authContextValue}>
			<BrowserRouter>{children}</BrowserRouter>
		</AuthContext.Provider>
	);
}

function useAuth(): AuthContext {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within a AuthRouteProvider');
	}
	return context;
}
export { useAuth, AuthRouteProvider };
