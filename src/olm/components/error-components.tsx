import type { FC, ReactNode } from 'react';
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
