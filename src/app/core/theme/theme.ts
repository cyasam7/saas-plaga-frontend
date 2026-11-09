import { createTheme, ThemeOptions } from '@mui/material/styles';
import _ from '@lodash';

const lightTextPalette = {
	primary: 'rgb(17, 24, 39)',
	secondary: 'rgb(107, 114, 128)',
	disabled: 'rgb(149, 156, 169)'
};

const darkTextPalette = {
	primary: 'rgb(255,255,255)',
	secondary: 'rgb(148, 163, 184)',
	disabled: 'rgb(156, 163, 175)'
};

const secondaryTealPalette = {
	main: '#009688',
	light: '#52C7B8',
	dark: '#00675B',
	contrastText: darkTextPalette.primary
};

/**
 * Typography and component defaults shared by every theme section (main, navbar).
 * `htmlFontSize: 10` matches the 62.5% root font size used by the Tailwind config (1rem = 10px).
 */
const baseThemeOptions: ThemeOptions = {
	typography: {
		fontFamily: ['Inter var', 'Roboto', '"Helvetica"', 'Arial', 'sans-serif'].join(','),
		fontWeightLight: 300,
		fontWeightRegular: 400,
		fontWeightMedium: 500,
		htmlFontSize: 10,
		fontSize: 14,
		body1: { fontSize: '1.4rem' },
		body2: { fontSize: '1.4rem' }
	},
	components: {
		MuiAppBar: {
			defaultProps: { enableColorOnDark: true },
			styleOverrides: { root: { backgroundImage: 'none' } }
		},
		MuiAutocomplete: {
			styleOverrides: { popper: { zIndex: 99999 } }
		},
		MuiButtonBase: {
			defaultProps: { disableRipple: true }
		},
		MuiButton: {
			defaultProps: { variant: 'text', color: 'inherit' },
			styleOverrides: {
				root: { textTransform: 'none' },
				sizeMedium: { borderRadius: 20, height: 40, minHeight: 40, maxHeight: 40 },
				sizeSmall: { borderRadius: '15px' },
				sizeLarge: { borderRadius: '28px' },
				contained: { boxShadow: 'none', '&:hover, &:focus': { boxShadow: 'none' } }
			}
		},
		MuiButtonGroup: {
			defaultProps: { color: 'secondary' },
			styleOverrides: { contained: { borderRadius: 18 } }
		},
		MuiTab: {
			styleOverrides: { root: { textTransform: 'none' } }
		},
		MuiDialog: {
			styleOverrides: { paper: { borderRadius: 16 } }
		},
		MuiPaper: {
			styleOverrides: { root: { backgroundImage: 'none' }, rounded: { borderRadius: 16 } }
		},
		MuiPopover: {
			styleOverrides: { paper: { borderRadius: 8 } }
		},
		MuiTextField: {
			defaultProps: { color: 'secondary' },
			styleOverrides: { root: { '& .MuiOutlinedInput-root': { borderRadius: 20 } } }
		},
		MuiInputLabel: { defaultProps: { color: 'secondary' } },
		MuiSelect: { defaultProps: { color: 'secondary' } },
		MuiOutlinedInput: { defaultProps: { color: 'secondary' } },
		MuiInputBase: {
			styleOverrides: { root: { minHeight: 40, lineHeight: 1 } }
		},
		MuiFilledInput: {
			styleOverrides: { root: { borderRadius: 4, '&:before, &:after': { display: 'none' } } }
		},
		MuiSlider: { defaultProps: { color: 'secondary' } },
		MuiCheckbox: { defaultProps: { color: 'secondary' } },
		MuiRadio: { defaultProps: { color: 'secondary' } },
		MuiSwitch: { defaultProps: { color: 'secondary' } }
	}
};

/** Pickers popper z-index (MuiPickersPopper isn't in core MUI's component types). */
const pickersThemeOptions = {
	components: { MuiPickersPopper: { styleOverrides: { root: { zIndex: 99999 } } } }
} as ThemeOptions;

function buildTheme(paletteOptions: ThemeOptions['palette']) {
	return createTheme(_.merge({}, baseThemeOptions, pickersThemeOptions, { palette: paletteOptions }));
}

/** Light "charcoal teal" theme used by pages and the toolbar. */
export const mainTheme = buildTheme({
	mode: 'light',
	primary: { main: '#094a43', light: '#28635a', dark: '#004a41', contrastText: darkTextPalette.primary },
	secondary: secondaryTealPalette,
	background: { default: '#edf6fa', paper: '#f7fcfc' },
	text: lightTextPalette,
	divider: '#cee5f0'
});

/** Dark variant used by the side navbar. */
export const navbarTheme = buildTheme({
	mode: 'dark',
	primary: { main: '#455A64', light: '#718792', dark: '#1C313A', contrastText: darkTextPalette.primary },
	secondary: secondaryTealPalette,
	background: { default: '#000000', paper: '#102027' },
	text: darkTextPalette,
	divider: '#2d383d'
});
