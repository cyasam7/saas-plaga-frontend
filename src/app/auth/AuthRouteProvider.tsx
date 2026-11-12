import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ISignInPayload, ISignUpPayload } from 'src/app/requests/auth/types';
import { BrowserRouter } from 'react-router-dom';
import SplashScreen from 'app/core/feedback/SplashScreen';
import { PartialDeep } from 'type-fest';
import firebase from 'firebase/compat/app';
import _ from '@lodash';
import { useQueryClient } from 'react-query';
import useJwtAuth, { JwtAuth } from './services/jwt/useJwtAuth';
import { User } from './user';
import useFirebaseAuth from './services/firebase/useFirebaseAuth';
import UserModel from './user/models/UserModel';

/**
 * Initialize Firebase
 */

// Cuerpos de POST /auth/sign-in y /auth/sign-up: viven en `src/app/requests/auth/types.ts`.
export type SignInPayload = ISignInPayload;

export type SignUpPayload = ISignUpPayload;

type AuthContext = {
	user: User;
	jwtService?: JwtAuth<User, SignInPayload, SignUpPayload>;
	firebaseService?: ReturnType<typeof useFirebaseAuth>;
	signOut?: () => void;
	updateUser?: (U: PartialDeep<User>) => void;
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
			setAuthService('jwt');
		},
		onSignedUp: (user: User) => {
			replaceUser(user);
			setAuthService('jwt');
		},
		onSignedOut: () => {
			queryClient.removeQueries();

			resetUser();
			resetAuthService();
		},
		onUpdateUser: (user) => {
			mergeUser(user);
		},
		onError: (error) => {
			// eslint-disable-next-line no-console
			console.warn(error);
		}
	});

	/**
	 * Firebase auth service
	 */
	const firebaseService: AuthContext['firebaseService'] = useFirebaseAuth<User>({
		onSignedIn: (_user) => {
			firebase
				.database()
				.ref(`users/${_user.uid}`)
				.once('value')
				.then((snapshot) => {
					const user = snapshot.val() as User;
					replaceUser(user);
					setAuthService('firebase');
				});
		},
		onSignedUp: (userCredential, displayName) => {
			const _user = userCredential.user;

			const user = UserModel({
				uid: _user.uid,
				role: ['admin'],
				data: {
					displayName,
					email: _user.email
				}
			});

			firebaseService.updateUser(user);

			setAuthService('firebase');
		},
		onSignedOut: () => {
			resetUser();
			resetAuthService();
		},
		onUpdateUser: (user) => {
			mergeUser(user);
		},
		onError: (error) => {
			// eslint-disable-next-line no-console
			console.warn(error);
		}
	});

	/**
	 * Check if services is in loading state
	 */
	const isLoading = useMemo(
		() => jwtService?.isLoading || firebaseService?.isLoading,
		[jwtService?.isLoading, firebaseService?.isLoading]
	);

	/**
	 * Check if user is authenticated
	 */
	const isAuthenticated = useMemo(
		() => jwtService?.isAuthenticated || firebaseService?.isAuthenticated,
		[jwtService?.isAuthenticated, firebaseService?.isAuthenticated]
	);

	/**
	 * Combine auth services
	 */
	const combinedAuth = useMemo<AuthContext>(
		() => ({
			user,
			jwtService,
			firebaseService,
			signOut: () => {
				const authService = getAuthService();

				if (authService === 'jwt') {
					return jwtService?.signOut();
				}

				if (authService === 'firebase') {
					return firebaseService?.signOut();
				}

				return null;
			},
			updateUser: (userData) => {
				const authService = getAuthService();

				if (authService === 'jwt') {
					return jwtService?.updateUser(userData);
				}

				if (authService === 'firebase') {
					return firebaseService?.updateUser(_.merge({}, user, userData));
				}

				return null;
			},
			isAuthenticated
		}),
		[isAuthenticated, user]
	);

	/**
	 * Get auth service
	 */
	const getAuthService = useCallback(() => {
		return localStorage.getItem('authService');
	}, []);

	/**
	 * Set auth service
	 */
	const setAuthService = useCallback((authService: string) => {
		if (authService) {
			localStorage.setItem('authService', authService);
		}
	}, []);

	/**
	 * Reset auth service
	 */
	const resetAuthService = useCallback(() => {
		localStorage.removeItem('authService');
	}, []);

	/**
	 * Render loading screen while loading user data
	 */
	if (isLoading) {
		return <SplashScreen />;
	}

	return (
		<AuthContext.Provider value={combinedAuth}>
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
