import { ReactNode } from 'react';
import { alpha, ThemeProvider } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
import { mainTheme } from './theme';

type AppThemeProviderProps = {
	children: ReactNode;
};

/**
 * Global element styles that make plain HTML / Tailwind borders follow the MUI palette.
 */
const themeGlobalStyles = (
	<GlobalStyles
		styles={(theme) => ({
			html: {
				backgroundColor: `${theme.palette.background.default}!important`,
				color: `${theme.palette.text.primary}!important`
			},
			body: {
				backgroundColor: theme.palette.background.default,
				color: theme.palette.text.primary
			},
			'table.simple tbody tr th, table.simple thead tr th': {
				borderColor: theme.palette.divider
			},
			'a:not([role=button]):not(.MuiButtonBase-root)': {
				color: theme.palette.secondary.main,
				textDecoration: 'underline'
			},
			'a.link, a:not([role=button])[target=_blank]': {
				background: alpha(theme.palette.secondary.main, 0.2),
				color: 'inherit',
				borderBottom: `1px solid ${theme.palette.divider}`,
				textDecoration: 'none',
				'&:hover': {
					background: alpha(theme.palette.secondary.main, 0.3),
					textDecoration: 'none'
				}
			},
			'[class^="border"], [class*="border"], [class*="divide-"] > :not([hidden]) ~ :not([hidden]), hr': {
				borderColor: theme.palette.divider
			},
			'::-webkit-scrollbar-thumb': {
				boxShadow: 'inset 0 0 0 20px rgba(0, 0, 0, 0.24)'
			},
			'::-webkit-scrollbar-thumb:active': {
				boxShadow: 'inset 0 0 0 20px rgba(0, 0, 0, 0.37)'
			}
		})}
	/>
);

/**
 * Provides the app's MUI theme. The navbar nests its own ThemeProvider with `navbarTheme`.
 */
function AppThemeProvider(props: AppThemeProviderProps) {
	const { children } = props;

	return (
		<ThemeProvider theme={mainTheme}>
			{themeGlobalStyles}
			{children}
		</ThemeProvider>
	);
}

export default AppThemeProvider;
