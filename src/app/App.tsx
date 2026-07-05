import FuseLayout from '@fuse/core/FuseLayout';
import FuseTheme from '@fuse/core/FuseTheme';
import { SnackbarProvider } from 'notistack';
import { useSelector } from 'react-redux';
import rtlPlugin from 'stylis-plugin-rtl';
import createCache, { Options } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { selectCurrentLanguageDirection } from 'app/store/i18nSlice';
import themeLayouts from 'app/theme-layouts/themeLayouts';
import { selectMainTheme } from '@fuse/core/FuseSettings/store/fuseSettingsSlice';
import axios from 'axios';
import { QueryClientProvider, QueryClient } from 'react-query';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import dayjs from 'dayjs';
import { pdfjs } from 'react-pdf';
import withAppProviders from './withAppProviders';
import { AuthRouteProvider } from './auth/AuthRouteProvider';
import GlobalDialog from './shared-components/GlobalDialog/GlobalDialog';
import 'dayjs/locale/es'; // import locale

/**
 * Axios HTTP Request defaults
 */
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();

dayjs.locale('es');
dayjs.extend(utc);
dayjs.extend(timezone);

export const emotionCacheOptions = {
	rtl: {
		key: 'muirtl',
		stylisPlugins: [rtlPlugin],
		insertionPoint: document.getElementById('emotion-insertion-point')
	},
	ltr: {
		key: 'muiltr',
		stylisPlugins: [],
		insertionPoint: document.getElementById('emotion-insertion-point')
	}
};

const queryClient = new QueryClient();

/**
 * The main App component.
 */
function App() {
	/**
	 * The language direction from the Redux store.
	 */
	const langDirection = useSelector(selectCurrentLanguageDirection);

	/**
	 * The main theme from the Redux store.
	 */
	const mainTheme = useSelector(selectMainTheme);

	return (
		<QueryClientProvider client={queryClient}>
			<CacheProvider value={createCache(emotionCacheOptions[langDirection] as Options)}>
				<FuseTheme
					theme={mainTheme}
					direction={langDirection}
				>
					<AuthRouteProvider>
						<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
							<SnackbarProvider
								maxSnack={5}
								anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'right'
								}}
								classes={{
									containerRoot: 'bottom-0 right-0 mb-52 md:mb-68 mr-8 lg:mr-80 z-99'
								}}
							>
								<FuseLayout layouts={themeLayouts} />
								<GlobalDialog />
							</SnackbarProvider>
						</LocalizationProvider>
					</AuthRouteProvider>
				</FuseTheme>
			</CacheProvider>
		</QueryClientProvider>
	);
}

export default withAppProviders(App);
