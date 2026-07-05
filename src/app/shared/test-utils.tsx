import React from 'react'
import { Provider } from 'react-redux'
import { configureAppStore } from 'app/store/store'
import ErrorBoundary from '@fuse/utils/ErrorBoundary'
import { StyledEngineProvider } from '@mui/material'
import { QueryClient, QueryClientProvider } from 'react-query'
export * from '@testing-library/react'

export const renderWithRedux = (children: React.ReactNode, initialState: any) => {
  const store = configureAppStore(initialState)
  const queryClient = new QueryClient()


  return (
    <ErrorBoundary>
      <Provider store={store}>
        <StyledEngineProvider injectFirst>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </StyledEngineProvider>
      </Provider>
    </ErrorBoundary>
  )
}



