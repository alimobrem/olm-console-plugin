/**
 * Simple components previously imported from @console/shared.
 * Uses PatternFly components where appropriate.
 */
import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import { Alert, AlertActionCloseButton, AlertVariant } from '@patternfly/react-core';
import {
  ArrowCircleUpIcon,
  InfoCircleIcon,
} from '@patternfly/react-icons';

// Re-export compat icons (not available from the SDK at runtime)
export {
  GreenCheckCircleIcon,
  YellowExclamationTriangleIcon,
  RedExclamationCircleIcon,
} from './sdk-compat';
// Also import YellowExclamationTriangleIcon for local use in WarningStatus
import { YellowExclamationTriangleIcon } from './sdk-compat';

// Re-export compat components (not available from the SDK at runtime)
export {
  Status,
  SuccessStatus,
  LazyActionMenu,
} from './sdk-compat';

export { ActionMenuVariant } from './sdk-compat';

/**
 * Blue arrow circle up icon.
 */
export const BlueArrowCircleUpIcon: FC<{ className?: string }> = ({ className }) => (
  <ArrowCircleUpIcon className={className} color="var(--pf-t--color--blue--default)" />
);

/**
 * Blue info circle icon.
 */
export const BlueInfoCircleIcon: FC<{ className?: string }> = ({ className }) => (
  <InfoCircleIcon className={className} color="var(--pf-t--color--blue--default)" />
);

/**
 * Warning status display.
 */
export const WarningStatus: FC<{ title?: string }> = ({ title }) => (
  <span className="co-icon-and-text">
    <YellowExclamationTriangleIcon />
    {title || 'Warning'}
  </span>
);

/**
 * A dismissable alert component.
 */
export const DismissableAlert: FC<{
  variant?: AlertVariant | keyof typeof AlertVariant;
  title: string;
  children?: ReactNode;
  className?: string;
}> = ({ variant = AlertVariant.info, title, children, className }) => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <Alert
      variant={variant as AlertVariant}
      title={title}
      className={className}
      actionClose={<AlertActionCloseButton onClose={() => setVisible(false)} />}
      isInline
    >
      {children}
    </Alert>
  );
};

/**
 * An inline error alert.
 */
export const ErrorAlert: FC<{ message: string }> = ({ message }) => (
  <Alert variant={AlertVariant.danger} isInline title="Error">
    {message}
  </Alert>
);

/**
 * A simple list component for displaying items.
 */
export const PlainList: FC<{ items: string[] }> = ({ items }) => {
  if (!items?.length) return null;
  return (
    <ul className="pf-v6-c-list pf-m-plain">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
};
PlainList.displayName = 'PlainList';
