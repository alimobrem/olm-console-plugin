/**
 * Alert for suggesting the user switch to YAML editor.
 * Previously imported from @console/shared/src/components/alerts/SwitchToYAMLAlert.
 */
import type { FC } from 'react';
import { Alert } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';

const SwitchToYAMLAlert: FC = () => {
  const { t } = useTranslation();
  return (
    <Alert variant="info" isInline title={t('public~Switch to YAML')}>
      {t(
        'public~Some fields may not be represented in this form view. Please select "YAML view" for full control.',
      )}
    </Alert>
  );
};

export default SwitchToYAMLAlert;
