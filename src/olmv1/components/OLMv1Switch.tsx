// TODO(CONSOLE-4823): Remove when OLMv1 GAs
import { useCallback } from 'react';
import type { FC, FormEvent } from 'react';
import { Flex, FlexItem, Switch } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { useFlag } from '@openshift-console/dynamic-plugin-sdk';
import { useUserPreference } from '@openshift-console/dynamic-plugin-sdk';
import { OLMV1_ENABLED_USER_PREFERENCE_KEY } from '../const';
import { OLMv1TechPreviewBadge } from './OLMv1TechPreviewBadge';

const FLAG_TECH_PREVIEW = 'TECH_PREVIEW';

export const OLMv1Switch: FC = () => {
  const { t } = useTranslation();
  const techPreviewEnabled = useFlag(FLAG_TECH_PREVIEW);
  const [olmv1Enabled, setOlmv1Enabled] = useUserPreference<boolean>(
    OLMV1_ENABLED_USER_PREFERENCE_KEY,
    techPreviewEnabled ?? false,
    true,
  );

  const handleToggle = useCallback(
    (_event: FormEvent<HTMLInputElement>, checked: boolean) => {
      setOlmv1Enabled(checked);
    },
    [setOlmv1Enabled],
  );

  return (
    <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
      <FlexItem>
        <Switch
          id="olmv1-toggle"
          label={t('olm-v1~Enable OLMv1')}
          isChecked={olmv1Enabled ?? false}
          onChange={handleToggle}
          aria-label={t('olm-v1~Toggle OLMv1 UI')}
        />
      </FlexItem>
      <FlexItem>
        <OLMv1TechPreviewBadge />
      </FlexItem>
    </Flex>
  );
};
