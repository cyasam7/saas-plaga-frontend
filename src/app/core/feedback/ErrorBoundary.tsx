import { Component, ErrorInfo, ReactNode } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  caughtError: Error | null;
  caughtErrorInfo: ErrorInfo | null;
};

/**
 * Catches render errors anywhere below it and shows the error instead of a blank page.
 * Must be a class component: React has no hook equivalent for error boundaries.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { caughtError: null, caughtErrorInfo: null };

  static getDerivedStateFromError(caughtError: Error): Partial<ErrorBoundaryState> {
    return { caughtError };
  }

  componentDidCatch(caughtError: Error, caughtErrorInfo: ErrorInfo) {
    this.setState({ caughtError, caughtErrorInfo });
    console.error('Uncaught error:', caughtError, caughtErrorInfo);
  }

  render() {
    const { children } = this.props;
    const { caughtError, caughtErrorInfo } = this.state;

    if (!caughtError) {
      return children;
    }

    return (
      <div className="bg-white p-24">
        <h1 className="text-20 font-semibold">Algo salió mal.</h1>
        <p className="whitespace-pre-wrap text-14">
          {caughtError.toString()}
          <br />
          {caughtErrorInfo?.componentStack}
        </p>
      </div>
    );
  }
}

export default ErrorBoundary;
