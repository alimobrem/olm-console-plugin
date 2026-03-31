/**
 * Minimal operator install status page using SDK components directly.
 */
import type { FC } from 'react';
import { useParams } from 'react-router';
import {
  Spinner,
  Title,
  PageSection,
  TextContent,
  Text,
} from '@patternfly/react-core';

export const OperatorInstallStatusPage: FC = () => {
  const { name, ns: namespace } = useParams<{ name: string; ns: string }>();

  return (
    <PageSection>
      <Title headingLevel="h1">Installing Operator</Title>
      <TextContent style={{ marginTop: '1rem' }}>
        <Text>
          Installing <strong>{name || 'operator'}</strong>
          {namespace ? ` in namespace ${namespace}` : ''}...
        </Text>
      </TextContent>
      <div style={{ marginTop: '2rem' }}>
        <Spinner size="xl" />
      </div>
    </PageSection>
  );
};

export default OperatorInstallStatusPage;
