import type { ComponentType, FC, ReactNode } from 'react';
import { Component } from 'react';
import { Alert, AlertVariant } from '@patternfly/react-core';

export const ErrorMessage: FC<{ message: string }> = ({ message }) => (
  <Alert variant={AlertVariant.danger} isInline title={message} />
);

export const LoadError: FC<{ label?: string; message?: string; className?: string }> = ({
  label,
  message,
  className,
}) => (
  <div className={className}>
    <Alert
      variant={AlertVariant.danger}
      isInline
      title={message || `Error loading ${label || 'data'}`}
    />
  </div>
);

export const ErrorPage404: FC<{ message?: string; children?: ReactNode }> = ({
  message,
  children,
}) => (
  <div className="co-m-pane__body">
    <h1 className="co-m-pane__heading co-m-pane__heading--center">404: Page Not Found</h1>
    {message && <div className="text-center">{message}</div>}
    {children}
  </div>
);

export const ErrorBoundaryFallbackPage: FC<{ errorMessage: string; componentStack?: string }> = ({
  errorMessage,
}) => (
  <div className="co-m-pane__body">
    <Alert variant={AlertVariant.danger} isInline title="Something went wrong">
      {errorMessage}
    </Alert>
  </div>
);

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<
  { FallbackComponent?: ComponentType<{ errorMessage: string; componentStack?: string }>; children?: ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.FallbackComponent || ErrorBoundaryFallbackPage;
      return <Fallback errorMessage={this.state.error?.message || 'Unknown error'} />;
    }
    return this.props.children;
  }
}

export function withFallback<P extends object>(
  WrappedComponent: ComponentType<P>,
  FallbackComponent?: ComponentType<{ errorMessage: string; componentStack?: string }>,
): FC<P> {
  const WithFallback: FC<P> = (props) => (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );
  return WithFallback;
}
