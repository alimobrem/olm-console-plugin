/**
 * Subscription detail page with professional styling.
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
  Label,
  Flex,
  FlexItem,
  Divider,
  LabelGroup,
} from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InProgressIcon,
  BanIcon,
} from '@patternfly/react-icons';

const stateColor = (state: string): 'green' | 'red' | 'blue' | 'orange' | 'grey' => {
  switch (state) {
    case 'AtLatestKnown':
      return 'green';
    case 'UpgradePending':
      return 'blue';
    case 'UpgradeAvailable':
      return 'orange';
    case 'Failed':
      return 'red';
    default:
      return 'grey';
  }
};

const stateIcon = (state: string) => {
  switch (state) {
    case 'AtLatestKnown':
      return <CheckCircleIcon />;
    case 'UpgradePending':
      return <InProgressIcon />;
    case 'Failed':
      return <ExclamationCircleIcon />;
    default:
      return undefined;
  }
};

const SubscriptionDetails: FC<{ obj: K8sResourceCommon }> = ({ obj }) => {
  const sub = obj as any;
  const state = sub?.status?.state || 'Unknown';
  const labels = obj.metadata?.labels || {};
  const catalogHealth: any[] = sub?.status?.catalogHealth || [];

  return (
    <>
      {/* Header */}
      <PageSection style={{ paddingBottom: 0 }}>
        <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }}>
          <FlexItem>
            <Title headingLevel="h1" size="xl">
              {obj.metadata?.name}
            </Title>
          </FlexItem>
          <FlexItem>
            <Label color={stateColor(state)} icon={stateIcon(state)}>
              {state}
            </Label>
          </FlexItem>
        </Flex>
      </PageSection>

      <Divider style={{ marginTop: 16, marginBottom: 0 }} />

      {/* Details */}
      <PageSection>
        <Title headingLevel="h2" size="lg" style={{ marginBottom: 16 }}>
          Subscription details
        </Title>
        <DescriptionList isHorizontal horizontalTermWidthModifier={{ default: '20ch' }}>
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
            <DescriptionListTerm>Labels</DescriptionListTerm>
            <DescriptionListDescription>
              {Object.keys(labels).length > 0 ? (
                <LabelGroup>
                  {Object.entries(labels).map(([key, value]) => (
                    <Label key={key} isCompact>
                      {key}={value}
                    </Label>
                  ))}
                </LabelGroup>
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
          <DescriptionListGroup>
            <DescriptionListTerm>Package</DescriptionListTerm>
            <DescriptionListDescription>
              {sub?.spec?.name || '-'}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Channel</DescriptionListTerm>
            <DescriptionListDescription>
              <Label isCompact color="blue">{sub?.spec?.channel || '-'}</Label>
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Source</DescriptionListTerm>
            <DescriptionListDescription>
              {sub?.spec?.source ? (
                <ResourceLink
                  groupVersionKind={{
                    group: 'operators.coreos.com',
                    version: 'v1alpha1',
                    kind: 'CatalogSource',
                  }}
                  name={sub.spec.source}
                  namespace={sub?.spec?.sourceNamespace || obj.metadata?.namespace}
                />
              ) : (
                '-'
              )}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Install plan approval</DescriptionListTerm>
            <DescriptionListDescription>
              <Label
                isCompact
                color={sub?.spec?.installPlanApproval === 'Automatic' ? 'green' : 'orange'}
                icon={sub?.spec?.installPlanApproval === 'Manual' ? <BanIcon /> : undefined}
              >
                {sub?.spec?.installPlanApproval || '-'}
              </Label>
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>State</DescriptionListTerm>
            <DescriptionListDescription>
              <Label color={stateColor(state)} icon={stateIcon(state)}>
                {state}
              </Label>
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Current CSV</DescriptionListTerm>
            <DescriptionListDescription>
              {sub?.status?.currentCSV ? (
                <ResourceLink
                  groupVersionKind={{
                    group: 'operators.coreos.com',
                    version: 'v1alpha1',
                    kind: 'ClusterServiceVersion',
                  }}
                  name={sub.status.currentCSV}
                  namespace={obj.metadata?.namespace}
                />
              ) : (
                '-'
              )}
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
        </DescriptionList>
      </PageSection>

      {/* Catalog health */}
      {catalogHealth.length > 0 && (
        <>
          <Divider />
          <PageSection>
            <Title headingLevel="h2" size="lg" style={{ marginBottom: 12 }}>
              Catalog health
            </Title>
            <DescriptionList isHorizontal horizontalTermWidthModifier={{ default: '20ch' }}>
              {catalogHealth.map((entry: any) => {
                const ref = entry?.catalogSourceRef;
                const healthy = entry?.healthy;
                return (
                  <DescriptionListGroup key={ref?.name || 'unknown'}>
                    <DescriptionListTerm>
                      {ref?.name || 'Unknown catalog'}
                    </DescriptionListTerm>
                    <DescriptionListDescription>
                      <Label
                        isCompact
                        color={healthy ? 'green' : 'red'}
                        icon={healthy ? <CheckCircleIcon /> : <ExclamationCircleIcon />}
                      >
                        {healthy ? 'Healthy' : 'Unhealthy'}
                      </Label>
                      {entry?.lastUpdated && (
                        <span style={{ marginLeft: 12, fontSize: '0.85em' }}>
                          Last updated: <Timestamp timestamp={entry.lastUpdated} />
                        </span>
                      )}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                );
              })}
            </DescriptionList>
          </PageSection>
        </>
      )}
    </>
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

  return <HorizontalNav pages={pages} resource={subscription} />;
};

export default SubscriptionDetailsPage;
