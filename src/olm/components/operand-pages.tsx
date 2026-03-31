/**
 * Minimal Operand detail page and CreateOperand placeholder using SDK components directly.
 */
import type { FC } from 'react';
import { useParams } from 'react-router';
import {
  useK8sWatchResource,
  HorizontalNav,
  Timestamp,
} from '@openshift-console/dynamic-plugin-sdk';
import type { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import {
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Spinner,
  Title,
  PageSection,
  CodeBlock,
  CodeBlockCode,
} from '@patternfly/react-core';

const OperandDetails: FC<{ obj: K8sResourceCommon }> = ({ obj }) => (
  <PageSection>
    <DescriptionList>
      <DescriptionListGroup>
        <DescriptionListTerm>Name</DescriptionListTerm>
        <DescriptionListDescription>
          {obj.metadata?.name || '-'}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Namespace</DescriptionListTerm>
        <DescriptionListDescription>
          {obj.metadata?.namespace || '-'}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Created</DescriptionListTerm>
        <DescriptionListDescription>
          <Timestamp timestamp={obj.metadata?.creationTimestamp} />
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Labels</DescriptionListTerm>
        <DescriptionListDescription>
          {obj.metadata?.labels
            ? Object.entries(obj.metadata.labels)
                .map(([k, v]) => `${k}=${v}`)
                .join(', ')
            : '-'}
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  </PageSection>
);

const OperandYAML: FC<{ obj: K8sResourceCommon }> = ({ obj }) => (
  <PageSection>
    <CodeBlock>
      <CodeBlockCode>{JSON.stringify(obj, null, 2)}</CodeBlockCode>
    </CodeBlock>
  </PageSection>
);

const pages = [
  { href: '', name: 'Details', component: OperandDetails },
  { href: 'yaml', name: 'YAML', component: OperandYAML },
];

export const OperandDetailsPage: FC = () => {
  const {
    plural,
    name,
    ns: namespace,
  } = useParams<{
    csvName: string;
    plural: string;
    name: string;
    ns: string;
  }>();

  const [resource, loaded, loadError] =
    useK8sWatchResource<K8sResourceCommon>({
      groupVersionKind: {
        group: '',
        version: 'v1',
        kind: plural || '',
      },
      name,
      namespace,
      isList: false,
    });

  if (loadError) {
    return (
      <PageSection>
        <p>
          Error loading resource: {loadError.message || String(loadError)}
        </p>
      </PageSection>
    );
  }

  if (!loaded) {
    return (
      <PageSection>
        <Spinner size="lg" />
      </PageSection>
    );
  }

  return (
    <>
      <Title headingLevel="h1" style={{ padding: '1rem 1.5rem 0' }}>
        {resource?.metadata?.name}
      </Title>
      <HorizontalNav pages={pages} resource={resource} />
    </>
  );
};

/** Placeholder create operand page */
const CreateOperand: FC = () => (
  <PageSection>
    <Title headingLevel="h1">Create Operand</Title>
    <p>Operand creation form will be displayed here.</p>
  </PageSection>
);

export default CreateOperand;
