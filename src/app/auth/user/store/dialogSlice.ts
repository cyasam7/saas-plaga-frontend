import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootStateType } from 'app/store/types';
import React from 'react';

type AppRootStateType = RootStateType<dialogSliceType>;

interface IGlobalDialogState {
	open: boolean;
	title: string;
	text: React.ReactNode;
	onAccept: () => Promise<void> | void;
	onCancel?: () => Promise<void> | void;
	textCancel?: string;
	textAccept?: string;
}

export type OpenDialog = Omit<IGlobalDialogState, 'open'>;

const initialState: IGlobalDialogState = {
	open: false,
	title: '',
	text: '',
	onAccept: () => {}
};

const dialogSlice = createSlice({
	name: 'dialogReducer',
	initialState,
	reducers: {
		openModal: (state, action: PayloadAction<OpenDialog>) => {
			state = {
				...state,
				open: true,
				...action.payload
			};
			return state;
		},
		closeModal: () => {
			return initialState;
		}
	}
});

export const { closeModal, openModal } = dialogSlice.actions;

export type dialogSliceType = typeof dialogSlice;

export const selectGlobalDialog = (state: AppRootStateType) => state.dialogReducer;

export const dialogReducer = dialogSlice.reducer;
