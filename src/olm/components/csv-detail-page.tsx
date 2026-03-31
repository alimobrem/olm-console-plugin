/**
 * ClusterServiceVersion details page using SDK components directly.
 */
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
} from '@patternfly/react-core';
import {
  HorizontalNav,
  useK8sWatchResource,
  ResourceLink,
  Timestamp,
} from '@openshift-console/dynamic-plugin-sdk';
import type { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';

const DetailsTab: FC<{ obj: K8sResourceCommon }> = ({ obj }) => {
  const { t } = useTranslation();
  const csv = obj as any;

  return (
    <div className="co-m-pane__body">
      <DescriptionList>
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
          <DescriptionListDescription>
            {csv?.spec?.version || '-'}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>{t('olm~Phase')}</DescriptionListTerm>
          <DescriptionListDescription>
            {csv?.status?.phase || '-'}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>{t('olm~Description')}</DescriptionListTerm>
          <DescriptionListDescription>
            {csv?.spec?.description || '-'}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>{t('olm~Created')}</DescriptionListTerm>
          <DescriptionListDescription>
            <Timestamp timestamp={obj.metadata?.creationTimestamp} />
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </div>
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
