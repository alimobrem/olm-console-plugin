/**
 * Minimal Subscription detail page using SDK components directly.
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

const SubscriptionDetails: FC<{ obj: K8sResourceCommon }> = ({ obj }) => {
  const sub = obj as any;
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
          <DescriptionListTerm>Channel</DescriptionListTerm>
          <DescriptionListDescription>
            {sub?.spec?.channel || '-'}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Package</DescriptionListTerm>
          <DescriptionListDescription>
            {sub?.spec?.name || '-'}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Source</DescriptionListTerm>
          <DescriptionListDescription>
            {sub?.spec?.source || '-'}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Install Plan Approval</DescriptionListTerm>
          <DescriptionListDescription>
            {sub?.spec?.installPlanApproval || '-'}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>State</DescriptionListTerm>
          <DescriptionListDescription>
            {sub?.status?.state || '-'}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Installed CSV</DescriptionListTerm>
          <DescriptionListDescription>
            {sub?.status?.installedCSV ? (
              <ResourceLink
                groupVersionKind={{
                  group: 'operators.coreos.com',
                  version: 'v1alpha1',
                  kind: 'ClusterServiceVersion',
                }}
                name={sub.status.installedCSV}
                namespace={obj.metadata?.namespace}
              />
            ) : (
              '-'
            )}
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

const SubscriptionEvents: FC<{ obj: K8sResourceCommon }> = () => (
  <PageSection>
    <Title headingLevel="h3">Events</Title>
    <p>Events will be displayed here.</p>
  </PageSection>
);

const pages = [
  { href: '', name: 'Details', component: SubscriptionDetails },
  { href: 'events', name: 'Events', component: SubscriptionEvents },
];

export const SubscriptionDetailsPage: FC = () => {
  const { name, ns: namespace } = useParams<{ name: string; ns: string }>();

  const [subscription, loaded, loadError] =
    useK8sWatchResource<K8sResourceCommon>({
      groupVersionKind: {
        group: 'operators.coreos.com',
        version: 'v1alpha1',
        kind: 'Subscription',
      },
      name,
      namespace,
      isList: false,
    });

  if (loadError) {
    return (
      <PageSection>
        <p>Error loading Subscription: {loadError.message || String(loadError)}</p>
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
        {subscription?.metadata?.name}
      </Title>
      <HorizontalNav pages={pages} resource={subscription} />
    </>
  );
};

export default SubscriptionDetailsPage;
