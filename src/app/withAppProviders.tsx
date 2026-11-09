import { ComponentType, PropsWithChildren } from 'react';
import { StyledEngineProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import ErrorBoundary from 'app/core/feedback/ErrorBoundary';
import store from './store/store';

type ComponentProps = {
	name?: string;
};

/**
 * A Higher Order Component that provides the necessary context providers for the app.
 */
function withAppProviders(Component: ComponentType<ComponentProps>) {
	function WithAppProviders(props: PropsWithChildren<ComponentProps>) {
		return (
			<ErrorBoundary>
				<Provider store={store}>
					<StyledEngineProvider injectFirst>
						<Component {...props} />
					</StyledEngineProvider>
				</Provider>
			</ErrorBoundary>
		);
	}

	return WithAppProviders;
}

export default withAppProviders;
