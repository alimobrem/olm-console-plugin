/**
 * CatalogSource detail page with professional styling.
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
  CatalogIcon,
} from '@patternfly/react-icons';

const CatalogSourceDetails: FC<{ obj: K8sResourceCommon }> = ({ obj }) => {
  const cs = obj as any;
  const displayName = cs?.spec?.displayName || obj.metadata?.name || '-';
  const icon = cs?.spec?.icon;
  const labels = obj.metadata?.labels || {};
  const connectionState = cs?.status?.connectionState;
  const lastConnect = connectionState?.lastConnect;
  const lastObservedState = connectionState?.lastObservedState || 'Unknown';
  const isHealthy = lastObservedState === 'READY';
  const updateStrategy = cs?.spec?.updateStrategy;
  const pollingInterval = updateStrategy?.registryPoll?.interval;

  return (
    <>
      {/* Header */}
      <PageSection style={{ paddingBottom: 0 }}>
        <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapLg' }}>
          {icon?.base64data && icon?.mediatype ? (
            <FlexItem>
              <img
                src={`data:${icon.mediatype};base64,${icon.base64data}`}
                alt={displayName}
                style={{ width: 48, height: 48 }}
              />
            </FlexItem>
          ) : (
            <FlexItem>
              <CatalogIcon style={{ width: 40, height: 40, color: 'var(--pf-t--global--color--nonstatus--gray--default)' }} />
            </FlexItem>
          )}
          <FlexItem>
            <Title headingLevel="h1" size="xl">
              {displayName}
            </Title>
            <Flex gap={{ default: 'gapSm' }} style={{ marginTop: 4 }}>
              {cs?.spec?.publisher && (
                <FlexItem>
                  <span style={{ fontSize: '0.9em', color: 'var(--pf-t--global--color--nonstatus--gray--default)' }}>
                    by {cs.spec.publisher}
                  </span>
                </FlexItem>
              )}
              <FlexItem>
                <Label
                  isCompact
                  color={isHealthy ? 'green' : 'red'}
                  icon={isHealthy ? <CheckCircleIcon /> : <ExclamationCircleIcon />}
                >
                  {isHealthy ? 'Available' : lastObservedState}
                </Label>
              </FlexItem>
            </Flex>
          </FlexItem>
        </Flex>
      </PageSection>

      <Divider style={{ marginTop: 16, marginBottom: 0 }} />

      {/* Details */}
      <PageSection>
        <Title headingLevel="h2" size="lg" style={{ marginBottom: 16 }}>
          CatalogSource details
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
            <DescriptionListTerm>Display name</DescriptionListTerm>
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
            <DescriptionListTerm>Source type</DescriptionListTerm>
            <DescriptionListDescription>
              <Label isCompact color="blue">
                {cs?.spec?.sourceType || '-'}
              </Label>
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Image</DescriptionListTerm>
            <DescriptionListDescription>
              <span style={{ wordBreak: 'break-all' }}>
                {cs?.spec?.image || '-'}
              </span>
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </PageSection>

      {/* Availability / Health */}
      <Divider />
      <PageSection>
        <Title headingLevel="h2" size="lg" style={{ marginBottom: 16 }}>
          Availability
        </Title>
        <DescriptionList isHorizontal horizontalTermWidthModifier={{ default: '20ch' }}>
          <DescriptionListGroup>
            <DescriptionListTerm>Connection state</DescriptionListTerm>
            <DescriptionListDescription>
              <Label
                color={isHealthy ? 'green' : 'red'}
                icon={isHealthy ? <CheckCircleIcon /> : <ExclamationCircleIcon />}
              >
                {lastObservedState}
              </Label>
            </DescriptionListDescription>
          </DescriptionListGroup>
          {lastConnect && (
            <DescriptionListGroup>
              <DescriptionListTerm>Last connected</DescriptionListTerm>
              <DescriptionListDescription>
                <Timestamp timestamp={lastConnect} />
              </DescriptionListDescription>
            </DescriptionListGroup>
          )}
          {connectionState?.message && (
            <DescriptionListGroup>
              <DescriptionListTerm>Message</DescriptionListTerm>
              <DescriptionListDescription>
                {connectionState.message}
              </DescriptionListDescription>
            </DescriptionListGroup>
          )}
        </DescriptionList>
      </PageSection>

      {/* Update strategy */}
      {pollingInterval && (
        <>
          <Divider />
          <PageSection>
            <Title headingLevel="h2" size="lg" style={{ marginBottom: 16 }}>
              Update strategy
            </Title>
            <DescriptionList isHorizontal horizontalTermWidthModifier={{ default: '20ch' }}>
              <DescriptionListGroup>
                <DescriptionListTerm>Registry polling interval</DescriptionListTerm>
                <DescriptionListDescription>
                  <Label isCompact color="blue">{pollingInterval}</Label>
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </PageSection>
        </>
      )}
    </>
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

  return <HorizontalNav pages={pages} resource={catalogSource} />;
};

export default CatalogSourceDetailsPage;
