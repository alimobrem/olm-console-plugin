/**
 * ClusterServiceVersion details page with professional styling.
 */
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Label,
  Flex,
  FlexItem,
  PageSection,
  Title,
  Divider,
  Split,
  SplitItem,
  LabelGroup,
} from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InProgressIcon,
} from '@patternfly/react-icons';
import {
  HorizontalNav,
  useK8sWatchResource,
  ResourceLink,
  Timestamp,
} from '@openshift-console/dynamic-plugin-sdk';
import type { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';

const phaseColor = (phase: string): 'green' | 'red' | 'blue' | 'grey' => {
  switch (phase) {
    case 'Succeeded':
      return 'green';
    case 'Failed':
      return 'red';
    case 'Installing':
    case 'Replacing':
    case 'Deleting':
      return 'blue';
    default:
      return 'grey';
  }
};

const phaseIcon = (phase: string) => {
  switch (phase) {
    case 'Succeeded':
      return <CheckCircleIcon />;
    case 'Failed':
      return <ExclamationCircleIcon />;
    case 'Installing':
    case 'Replacing':
    case 'Deleting':
      return <InProgressIcon />;
    default:
      return undefined;
  }
};

const DetailsTab: FC<{ obj: K8sResourceCommon }> = ({ obj }) => {
  const { t } = useTranslation();
  const csv = obj as any;

  const icon = csv?.spec?.icon?.[0];
  const displayName = csv?.spec?.displayName || csv?.metadata?.name || '-';
  const version = csv?.spec?.version || '-';
  const phase = csv?.status?.phase || 'Unknown';
  const description = csv?.spec?.description || '';
  const labels = obj.metadata?.labels || {};
  const annotations = obj.metadata?.annotations || {};
  const ownedCRDs: any[] = csv?.spec?.customresourcedefinitions?.owned || [];

  return (
    <>
      {/* Header section */}
      <PageSection style={{ paddingBottom: 0 }}>
        <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapLg' }}>
          {icon?.base64data && icon?.mediatype && (
            <FlexItem>
              <img
                src={`data:${icon.mediatype};base64,${icon.base64data}`}
                alt={displayName}
                style={{ width: 48, height: 48 }}
              />
            </FlexItem>
          )}
          <FlexItem>
            <Title headingLevel="h1" size="xl">
              {displayName}
            </Title>
            <Flex gap={{ default: 'gapSm' }} style={{ marginTop: 4 }}>
              <FlexItem>
                <Label isCompact color="blue">{version}</Label>
              </FlexItem>
              <FlexItem>
                <Label isCompact color={phaseColor(phase)} icon={phaseIcon(phase)}>
                  {phase}
                </Label>
              </FlexItem>
            </Flex>
          </FlexItem>
        </Flex>
      </PageSection>

      <Divider style={{ marginTop: 16, marginBottom: 0 }} />

      {/* Resource summary */}
      <PageSection>
        <Title headingLevel="h2" size="lg" style={{ marginBottom: 16 }}>
          {t('olm~Details')}
        </Title>
        <DescriptionList isHorizontal horizontalTermWidthModifier={{ default: '15ch' }}>
          <DescriptionListGroup>
            <DescriptionListTerm>{t('olm~Name')}</DescriptionListTerm>
            <DescriptionListDescription>
              {obj.metadata?.name || '-'}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>{t('olm~Namespace')}</DescriptionListTerm>
            <DescriptionListDescription>
              <ResourceLink kind="Namespace" name={obj.metadata?.namespace} />
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>{t('olm~Version')}</DescriptionListTerm>
            <DescriptionListDescription>{version}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>{t('olm~Status')}</DescriptionListTerm>
            <DescriptionListDescription>
              <Label color={phaseColor(phase)} icon={phaseIcon(phase)}>
                {phase}
              </Label>
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>{t('olm~Created')}</DescriptionListTerm>
            <DescriptionListDescription>
              <Timestamp timestamp={obj.metadata?.creationTimestamp} />
            </DescriptionListDescription>
          </DescriptionListGroup>

          {/* Labels */}
          <DescriptionListGroup>
            <DescriptionListTerm>{t('olm~Labels')}</DescriptionListTerm>
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

          {/* Annotations */}
          <DescriptionListGroup>
            <DescriptionListTerm>{t('olm~Annotations')}</DescriptionListTerm>
            <DescriptionListDescription>
              {Object.keys(annotations).length > 0
                ? `${Object.keys(annotations).length} annotation(s)`
                : '-'}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </PageSection>

      {/* Description section */}
      {description && (
        <>
          <Divider />
          <PageSection>
            <Title headingLevel="h2" size="lg" style={{ marginBottom: 12 }}>
              {t('olm~Description')}
            </Title>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
              {description}
            </div>
          </PageSection>
        </>
      )}

      {/* Provided APIs section */}
      {ownedCRDs.length > 0 && (
        <>
          <Divider />
          <PageSection>
            <Title headingLevel="h2" size="lg" style={{ marginBottom: 12 }}>
              {t('olm~Provided APIs')}
            </Title>
            <DescriptionList isHorizontal horizontalTermWidthModifier={{ default: '20ch' }}>
              {ownedCRDs.map((crd: any) => (
                <DescriptionListGroup key={crd.name}>
                  <DescriptionListTerm>
                    <Split hasGutter>
                      <SplitItem>
                        <strong>{crd.displayName || crd.kind}</strong>
                      </SplitItem>
                      <SplitItem>
                        <Label isCompact color="blue">{crd.version}</Label>
                      </SplitItem>
                    </Split>
                  </DescriptionListTerm>
                  <DescriptionListDescription>
                    <div>{crd.description || '-'}</div>
                    <div style={{ marginTop: 4, fontSize: '0.85em', color: 'var(--pf-t--global--color--nonstatus--gray--default)' }}>
                      {crd.name}
                    </div>
                  </DescriptionListDescription>
                </DescriptionListGroup>
              ))}
            </DescriptionList>
          </PageSection>
        </>
      )}
    </>
  );
};

const YAMLTab: FC<{ obj: K8sResourceCommon }> = ({ obj }) => (
  <div className="co-m-pane__body">
    <pre>{JSON.stringify(obj, null, 2)}</pre>
  </div>
);

const SubscriptionsTab: FC<{ obj: K8sResourceCommon }> = () => (
  <div className="co-m-pane__body">Subscriptions placeholder</div>
);

const EventsTab: FC<{ obj: K8sResourceCommon }> = () => (
  <div className="co-m-pane__body">Events placeholder</div>
);

export const ClusterServiceVersionDetailsPage: FC = () => {
  const { ns, name } = useParams<{ ns: string; name: string }>();

  const [csv, loaded, loadError] = useK8sWatchResource<K8sResourceCommon>({
    groupVersionKind: {
      group: 'operators.coreos.com',
      version: 'v1alpha1',
      kind: 'ClusterServiceVersion',
    },
    name,
    namespace: ns,
  });

  if (!loaded) {
    return <div className="co-m-pane__body">Loading...</div>;
  }
  if (loadError) {
    return <div className="co-m-pane__body">Error: {loadError.message || String(loadError)}</div>;
  }

  const pages = [
    { href: '', name: 'Details', component: DetailsTab },
    { href: 'yaml', name: 'YAML', component: YAMLTab },
    { href: 'subscriptions', name: 'Subscriptions', component: SubscriptionsTab },
    { href: 'events', name: 'Events', component: EventsTab },
  ];

  return <HorizontalNav resource={csv} pages={pages} />;
};

export default ClusterServiceVersionDetailsPage;
