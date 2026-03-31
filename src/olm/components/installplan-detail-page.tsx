/**
 * Minimal InstallPlan detail page using SDK components directly.
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

const InstallPlanDetails: FC<{ obj: K8sResourceCommon }> = ({ obj }) => {
  const ip = obj as any;
  const csvNames: string[] = ip?.spec?.clusterServiceVersionNames || [];
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
          <DescriptionListTerm>Approval</DescriptionListTerm>
          <DescriptionListDescription>
            {ip?.spec?.approval || '-'}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Approved</DescriptionListTerm>
          <DescriptionListDescription>
            {ip?.spec?.approved != null ? String(ip.spec.approved) : '-'}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Phase</DescriptionListTerm>
          <DescriptionListDescription>
            {ip?.status?.phase || '-'}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>CSV Names</DescriptionListTerm>
          <DescriptionListDescription>
            {csvNames.length > 0 ? csvNames.join(', ') : '-'}
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

const InstallPlanEvents: FC<{ obj: K8sResourceCommon }> = () => (
  <PageSection>
    <Title headingLevel="h3">Events</Title>
    <p>Events will be displayed here.</p>
  </PageSection>
);

const pages = [
  { href: '', name: 'Details', component: InstallPlanDetails },
  { href: 'events', name: 'Events', component: InstallPlanEvents },
];

export const InstallPlanDetailsPage: FC = () => {
  const { name, ns: namespace } = useParams<{ name: string; ns: string }>();

  const [installPlan, loaded, loadError] =
    useK8sWatchResource<K8sResourceCommon>({
      groupVersionKind: {
        group: 'operators.coreos.com',
        version: 'v1alpha1',
        kind: 'InstallPlan',
      },
      name,
      namespace,
      isList: false,
    });

  if (loadError) {
    return (
      <PageSection>
        <p>
          Error loading InstallPlan:{' '}
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
        {installPlan?.metadata?.name}
      </Title>
      <HorizontalNav pages={pages} resource={installPlan} />
    </>
  );
};

export default InstallPlanDetailsPage;
