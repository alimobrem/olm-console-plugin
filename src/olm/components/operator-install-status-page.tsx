/**
 * Minimal operator install status page using SDK components directly.
 */
import type { FC } from 'react';
import { useParams } from 'react-router';
import {
  Spinner,
  Title,
  PageSection,
  Content,
} from '@patternfly/react-core';

export const OperatorInstallStatusPage: FC = () => {
  const { name, ns: namespace } = useParams<{ name: string; ns: string }>();

  return (
    <PageSection>
      <Title headingLevel="h1">Installing Operator</Title>
      <Content style={{ marginTop: '1rem' }}>
        Installing <strong>{name || 'operator'}</strong>
        {namespace ? ` in namespace ${namespace}` : ''}...
      </Content>
      <div style={{ marginTop: '2rem' }}>
        <Spinner size="xl" />
      </div>
    </PageSection>
  );
};

export default OperatorInstallStatusPage;
