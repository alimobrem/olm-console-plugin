/**
 * Minimal CatalogSource detail page using SDK components directly.
 */
import type { FC } from 'react';
import { useParams } from 'react-router';
import {
  useK8sWatchResource,
  HorizontalNav,
  ResourceLink,
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
} from '@patternfly/react-core';

const CatalogSourceDetails: FC<{ obj: K8sResourceCommon }> = ({ obj }) => {
  const cs = obj as any;
  return (
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
            <ResourceLink kind="Namespace" name={obj.metadata?.namespace} />
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Display Name</DescriptionListTerm>
          <DescriptionListDescription>
            {cs?.spec?.displayName || '-'}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Publisher</DescriptionListTerm>
          <DescriptionListDescription>
            {cs?.spec?.publisher || '-'}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Source Type</DescriptionListTerm>
          <DescriptionListDescription>
            {cs?.spec?.sourceType || '-'}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Image</DescriptionListTerm>
          <DescriptionListDescription>
            {cs?.spec?.image || '-'}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Created</DescriptionListTerm>
          <DescriptionListDescription>
            <Timestamp timestamp={obj.metadata?.creationTimestamp} />
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </PageSection>
  );
};

const CatalogSourceEvents: FC<{ obj: K8sResourceCommon }> = () => (
  <PageSection>
    <Title headingLevel="h3">Events</Title>
    <p>Events will be displayed here.</p>
  </PageSection>
);

const pages = [
  { href: '', name: 'Details', component: CatalogSourceDetails },
  { href: 'events', name: 'Events', component: CatalogSourceEvents },
];

export const CatalogSourceDetailsPage: FC = () => {
  const { name, ns: namespace } = useParams<{ name: string; ns: string }>();

  const [catalogSource, loaded, loadError] =
    useK8sWatchResource<K8sResourceCommon>({
      groupVersionKind: {
        group: 'operators.coreos.com',
        version: 'v1alpha1',
        kind: 'CatalogSource',
      },
      name,
      namespace,
      isList: false,
    });

  if (loadError) {
    return (
      <PageSection>
        <p>
          Error loading CatalogSource:{' '}
          {loadError.message || String(loadError)}
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
        {catalogSource?.metadata?.name}
      </Title>
      <HorizontalNav pages={pages} resource={catalogSource} />
    </>
  );
};

export default CatalogSourceDetailsPage;
