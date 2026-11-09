import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import i18n from 'src/i18n';
import { RootStateType } from 'app/store/types';

type I18nState = {
	language: string;
};

/**
 * Current UI language (i18next is configured in src/i18n.ts).
 */
export const i18nSlice = createSlice({
	name: 'i18n',
	initialState: {
		language: i18n.options.lng
	} as I18nState,
	reducers: {
		languageChanged: (state, action: PayloadAction<string>) => {
			state.language = action.payload;
		}
	}
});

export type i18nSliceType = typeof i18nSlice;

type AppRootStateType = RootStateType<i18nSliceType>;

export const selectCurrentLanguageId = (state: AppRootStateType) => state.i18n.language;

export default i18nSlice.reducer;
