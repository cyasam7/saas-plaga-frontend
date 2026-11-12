import { SnackbarProvider } from 'notistack';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import axios from 'axios';
import { QueryClientProvider, QueryClient } from 'react-query';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import dayjs from 'dayjs';
import { pdfjs } from 'react-pdf';
import withAppProviders from './withAppProviders';
import { AuthRouteProvider } from './auth/AuthRouteProvider';
import { GlobalDialogProvider } from './shared/components/GlobalDialog/GlobalDialogContext';
import Toaster from './core/feedback/Toaster';
import AppThemeProvider from './core/theme/AppThemeProvider';
import AppLayout from './core/layout/AppLayout';
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

const emotionCache = createCache({
	key: 'muiltr',
	insertionPoint: document.getElementById('emotion-insertion-point') ?? undefined
});

const queryClient = new QueryClient();

/**
 * The main App component.
 */
function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<CacheProvider value={emotionCache}>
				<AppThemeProvider>
					<AuthRouteProvider>
						<LocalizationProvider
							dateAdapter={AdapterDayjs}
							adapterLocale="es"
						>
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
								<GlobalDialogProvider>
									<AppLayout />
									<Toaster />
								</GlobalDialogProvider>
							</SnackbarProvider>
						</LocalizationProvider>
					</AuthRouteProvider>
				</AppThemeProvider>
			</CacheProvider>
		</QueryClientProvider>
	);
}

export default withAppProviders(App);
