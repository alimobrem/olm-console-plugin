/**
 * Console plugin form components.
 * Migrated from @console/shared/src/components/utils/ConsolePluginRadioInputs
 * and @console/shared/src/components/utils/ConsolePluginWarning.
 */
import type { FC, ChangeEvent } from 'react';
import { Alert, FormGroup, Radio } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';

export const ConsolePluginRadioInputs: FC<ConsolePluginRadioInputsProps> = ({
  autofocus,
  enabled,
  onChange: setEnabled,
  name,
}) => {
  const { t } = useTranslation();
  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setEnabled(e.currentTarget.value === 'enabled');
  return (
    <FormGroup isStack>
      <Radio
        id={`${name}-enabled`}
        name={name}
        value="enabled"
        label={t('olm~Enable')}
        onChange={onChange}
        isChecked={enabled}
        data-checked-state={enabled}
        autoFocus={autofocus && enabled}
        data-test="Enable-radio-input"
      />
      <Radio
        id={`${name}-disabled`}
        name={name}
        value="disabled"
        label={t('olm~Disable')}
        onChange={onChange}
        isChecked={!enabled}
        data-checked-state={!enabled}
        autoFocus={autofocus && !enabled}
        data-test="Disable-radio-input"
      />
    </FormGroup>
  );
};

type ConsolePluginRadioInputsProps = {
  autofocus?: boolean;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  name: string;
};

export const ConsolePluginWarning: FC<ConsolePluginWarningProps> = ({
  enabled,
  previouslyEnabled,
  trusted,
}) => {
  const { t } = useTranslation();
  return (
    !previouslyEnabled &&
    enabled &&
    !trusted && (
      <Alert variant="warning" isInline title={t('olm~Enabling console plugin')}>
        <p>
          {t(
            'olm~This console plugin will be able to provide a custom interface and run any Kubernetes command as the logged in user. Make sure you trust it before enabling.',
          )}
        </p>
      </Alert>
    )
  );
};

type ConsolePluginWarningProps = {
  enabled: boolean;
  previouslyEnabled: boolean;
  trusted: boolean;
};
