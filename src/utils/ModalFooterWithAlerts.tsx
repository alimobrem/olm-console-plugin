import type { FC, ReactNode } from 'react';
import { Alert, ModalFooter } from '@patternfly/react-core';

export const ModalFooterWithAlerts: FC<ModalFooterWithAlertsProps> = ({
  children,
  errorMessage,
  infoMessage,
}) => (
  <>
    {errorMessage && (
      <Alert variant="danger" isInline title={errorMessage} className="co-alert co-alert--scrollable" />
    )}
    {infoMessage && (
      <Alert variant="info" isInline title={infoMessage} className="co-alert" />
    )}
    <ModalFooter>{children}</ModalFooter>
  </>
);

type ModalFooterWithAlertsProps = {
  children: ReactNode;
  errorMessage?: string;
  infoMessage?: string;
};
