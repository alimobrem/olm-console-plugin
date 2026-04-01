/**
 * InstallPlan detail page with professional styling.
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
  List,
  ListItem,
} from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InProgressIcon,
  BanIcon,
} from '@patternfly/react-icons';

const phaseColor = (phase: string): 'green' | 'red' | 'blue' | 'grey' => {
  switch (phase) {
    case 'Complete':
      return 'green';
    case 'Failed':
      return 'red';
    case 'Installing':
    case 'RequiresApproval':
      return 'blue';
    default:
      return 'grey';
  }
};

const phaseIcon = (phase: string) => {
  switch (phase) {
    case 'Complete':
      return <CheckCircleIcon />;
    case 'Failed':
      return <ExclamationCircleIcon />;
    case 'Installing':
      return <InProgressIcon />;
    case 'RequiresApproval':
      return <BanIcon />;
    default:
      return undefined;
  }
};

const InstallPlanDetails: FC<{ obj: K8sResourceCommon }> = ({ obj }) => {
  const ip = obj as any;
  const csvNames: string[] = ip?.spec?.clusterServiceVersionNames || [];
  const phase = ip?.status?.phase || 'Unknown';
  const approval = ip?.spec?.approval || '-';
  const approved = ip?.spec?.approved;
  const labels = obj.metadata?.labels || {};

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
            <Label color={phaseColor(phase)} icon={phaseIcon(phase)}>
              {phase}
            </Label>
          </FlexItem>
        </Flex>
      </PageSection>

      <Divider style={{ marginTop: 16, marginBottom: 0 }} />

      {/* Approval status - prominent display */}
      <PageSection style={{ paddingBottom: 0 }}>
        <Flex gap={{ default: 'gapLg' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <span style={{ fontWeight: 600, marginRight: 8 }}>Approval strategy:</span>
            <Label
              color={approval === 'Automatic' ? 'green' : 'orange'}
              icon={approval === 'Manual' ? <BanIcon /> : <CheckCircleIcon />}
            >
              {approval}
            </Label>
          </FlexItem>
          <FlexItem>
            <span style={{ fontWeight: 600, marginRight: 8 }}>Approved:</span>
            <Label
              color={approved === true ? 'green' : approved === false ? 'red' : 'grey'}
              icon={approved === true ? <CheckCircleIcon /> : approved === false ? <ExclamationCircleIcon /> : undefined}
            >
              {approved != null ? String(approved) : 'Unknown'}
            </Label>
          </FlexItem>
        </Flex>
      </PageSection>

      {/* Details */}
      <PageSection>
        <Title headingLevel="h2" size="lg" style={{ marginBottom: 16 }}>
          InstallPlan details
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
            <DescriptionListTerm>Phase</DescriptionListTerm>
            <DescriptionListDescription>
              <Label color={phaseColor(phase)} icon={phaseIcon(phase)}>
                {phase}
              </Label>
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Approval</DescriptionListTerm>
            <DescriptionListDescription>
              <Label
                isCompact
                color={approval === 'Automatic' ? 'green' : 'orange'}
              >
                {approval}
              </Label>
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Approved</DescriptionListTerm>
            <DescriptionListDescription>
              <Label
                isCompact
                color={approved === true ? 'green' : approved === false ? 'red' : 'grey'}
              >
                {approved != null ? String(approved) : '-'}
              </Label>
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </PageSection>

      {/* CSV Names as links */}
      {csvNames.length > 0 && (
        <>
          <Divider />
          <PageSection>
            <Title headingLevel="h2" size="lg" style={{ marginBottom: 12 }}>
              Planned ClusterServiceVersions
            </Title>
            <List isPlain>
              {csvNames.map((csvName) => (
                <ListItem key={csvName} style={{ marginBottom: 8 }}>
                  <ResourceLink
                    groupVersionKind={{
                      group: 'operators.coreos.com',
                      version: 'v1alpha1',
                      kind: 'ClusterServiceVersion',
                    }}
                    name={csvName}
                    namespace={obj.metadata?.namespace}
                  />
                </ListItem>
              ))}
            </List>
          </PageSection>
        </>
      )}
    </>
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

  return <HorizontalNav pages={pages} resource={installPlan} />;
};

export default InstallPlanDetailsPage;
