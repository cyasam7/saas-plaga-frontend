import { ComponentType, PropsWithChildren } from 'react';
import { StyledEngineProvider } from '@mui/material/styles';
import ErrorBoundary from 'app/core/feedback/ErrorBoundary';

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
				<StyledEngineProvider injectFirst>
					<Component {...props} />
				</StyledEngineProvider>
			</ErrorBoundary>
		);
	}

	return WithAppProviders;
}

export default withAppProviders;
