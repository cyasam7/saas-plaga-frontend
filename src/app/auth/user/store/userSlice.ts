/* eslint import/no-extraneous-dependencies: off */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from 'app/store/store';
import { User } from 'src/app/auth/user';
import { PartialDeep } from 'type-fest';
import _ from '@lodash';
import userModel from '../models/UserModel';

/**
 * Sets the user object in the Redux store.
 */
export const setUser = createAsyncThunk<User, User>('user/setUser', async (user) => user);

/**
 * Reset the user state.
 */
export const resetUser = createAsyncThunk('user/resetUser', async () => true);

/**
 * The initial state of the user slice.
 */
const initialState: User = userModel({});

/**
 * The User slice
 */
export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		/**
		 * Updates the user object in the Redux store.
		 */
		updateUser: (state, action) => {
			const oldState = _.cloneDeep(state);
			const user = action.payload as PartialDeep<User>;
			const newUser = _.merge({}, oldState, user);

			if (_.isEqual(oldState, newUser)) {
				return undefined;
			}
			return newUser as User;
		},
		userSignOut: () => initialState
	},
	extraReducers: (builder) => {
		builder.addCase(setUser.fulfilled, (state, action) => {
			const user = action.payload as PartialDeep<User>;
			const newUser = _.defaults(user, state);

			if (_.isEqual(state, newUser)) {
				return undefined;
			}
			return action.payload;
		});
		builder.addCase(resetUser.fulfilled, (state) => {
			if (!_.isEqual(state, initialState)) {
				return initialState;
			}
			return undefined;
		});
	}
});

export const { userSignOut, updateUser } = userSlice.actions;

export const selectUser = (state: RootState) => state?.user;

export const selectUserRole = (state: RootState) => state?.user?.role;

export default userSlice.reducer;
