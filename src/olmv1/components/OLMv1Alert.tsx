// TODO(CONSOLE-4823): Remove when OLMv1 GAs
import { Alert } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { ExternalLink } from '../../utils/ExternalLink';

const OLMv1Alert = () => {
  const { t } = useTranslation();
  return (
    <Alert
      variant="info"
      title={t('olm-v1~Operator Lifecycle Management version 1')}
      actionLinks={
        <ExternalLink href={`${window.SERVER_FLAGS.documentationBaseURL}html/extensions/index`}>
          {t('olm-v1~Learn more about OLMv1')}
        </ExternalLink>
      }
    >
      {t(
        "olm-v1~With OLMv1, you'll get a much simpler API that's easier to work with and understand. Plus, you have more direct control over updates. You can define update ranges and decide exactly how they are rolled out.",
      )}
    </Alert>
  );
};

export default OLMv1Alert;
