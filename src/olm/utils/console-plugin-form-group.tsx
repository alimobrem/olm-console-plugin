import type { FC, ChangeEvent } from 'react';
import { Alert, FormGroup, Radio } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { FieldLevelHelp } from '../../lib/console-components';
import { isCatalogSourceTrusted } from '../utils';

/* ---- Inlined ConsolePluginRadioInputs ---- */
type ConsolePluginRadioInputsProps = {
  autofocus?: boolean;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  name: string;
};

const ConsolePluginRadioInputs: FC<ConsolePluginRadioInputsProps> = ({
  autofocus,
  enabled,
  onChange: setEnabled,
  name,
}) => {
  const { t } = useTranslation();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setEnabled(e.currentTarget.value === 'enabled');
  return (
    <FormGroup isStack>
      <Radio
        id={`${name}-enabled`}
        name={name}
        value="enabled"
        label={t('olm~Enable')}
        onChange={handleChange}
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
        onChange={handleChange}
        isChecked={!enabled}
        data-checked-state={!enabled}
        autoFocus={autofocus && !enabled}
        data-test="Disable-radio-input"
      />
    </FormGroup>
  );
};

/* ---- Inlined ConsolePluginWarning ---- */
type ConsolePluginWarningProps = {
  enabled: boolean;
  previouslyEnabled: boolean;
  trusted: boolean;
};

const ConsolePluginWarning: FC<ConsolePluginWarningProps> = ({
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

export const ConsolePluginFormGroup: FC<ConsolePluginFormGroupProps> = ({
  catalogSource,
  csvPlugins,
  enabledPlugins,
  setPluginEnabled,
}) => {
  const { t } = useTranslation();
  const csvPluginsCount = csvPlugins.length;

  return (
    <div className="form-group">
      <fieldset>
        <label className="co-required">{t('olm~Console plugin', { count: csvPluginsCount })}</label>
        <FieldLevelHelp>
          {t(
            'olm~This operator includes a console plugin which provides a custom interface that can be included in the console. The console plugin will prompt for the console to be refreshed once it has been enabled. Make sure you trust this console plugin before enabling.',
          )}
        </FieldLevelHelp>
        {csvPlugins.map((plugin) => (
          <fieldset key={plugin}>
            <div>
              {csvPluginsCount > 1 && (
                <legend className="co-legend co-legend--nested pf-v6-u-text-color-subtle">
                  {plugin}
                </legend>
              )}
              <ConsolePluginRadioInputs
                name={plugin}
                enabled={enabledPlugins.includes(plugin)}
                onChange={(enabled: boolean) => setPluginEnabled(plugin, enabled)}
              />
            </div>
          </fieldset>
        ))}
        <ConsolePluginWarning
          // always show the warning for untrusted plugins set to enabled
          previouslyEnabled={false}
          enabled={enabledPlugins?.length > 0}
          trusted={isCatalogSourceTrusted(catalogSource)}
        />
      </fieldset>
    </div>
  );
};

type ConsolePluginFormGroupProps = {
  catalogSource: string;
  csvPlugins: string[];
  enabledPlugins: string[];
  setPluginEnabled: (plugin: string, enabled: boolean) => void;
};
