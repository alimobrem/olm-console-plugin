/**
 * Subscription list page with status labels and installed CSV info.
 */
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ListPageHeader,
  ListPageBody,
  ListPageFilter,
  VirtualizedTable,
  TableData,
  useListPageFilter,
  useK8sWatchResource,
  ResourceLink,
  Timestamp,
  useActiveNamespace,
} from '@openshift-console/dynamic-plugin-sdk';
import type {
  K8sResourceCommon,
  TableColumn,
  RowProps,
} from '@openshift-console/dynamic-plugin-sdk';
import { Label } from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InProgressIcon,
} from '@patternfly/react-icons';

const columns: TableColumn<K8sResourceCommon>[] = [
  { title: 'Name', id: 'name', sort: 'metadata.name' },
  { title: 'Namespace', id: 'namespace', sort: 'metadata.namespace' },
  { title: 'Status', id: 'status' },
  { title: 'Package', id: 'package' },
  { title: 'Channel', id: 'channel' },
  { title: 'Installed CSV', id: 'installedCSV' },
  { title: 'Approval Strategy', id: 'approval' },
  { title: 'Created', id: 'created', sort: 'metadata.creationTimestamp' },
];

const statusLabel = (state: string) => {
  switch (state) {
    case 'AtLatestKnown':
      return (
        <Label color="green" icon={<CheckCircleIcon />} isCompact>
          Up to date
        </Label>
      );
    case 'UpgradePending':
      return (
        <Label color="blue" icon={<InProgressIcon />} isCompact>
          Upgrade available
        </Label>
      );
    case 'UpgradeAvailable':
      return (
        <Label color="blue" icon={<InProgressIcon />} isCompact>
          Upgrade available
        </Label>
      );
    case 'UpgradeFailed':
      return (
        <Label color="red" icon={<ExclamationCircleIcon />} isCompact>
          Upgrade failed
        </Label>
      );
    default:
      return (
        <Label color="grey" isCompact>
          {state || 'Unknown'}
        </Label>
      );
  }
};

const SubscriptionRow: FC<RowProps<K8sResourceCommon>> = ({ obj, activeColumnIDs }) => {
  const sub = obj as any;
  const state = sub?.status?.state || '';
  const installedCSV = sub?.status?.installedCSV || '-';

  return (
    <>
      <TableData id="name" activeColumnIDs={activeColumnIDs}>
        <ResourceLink
          groupVersionKind={{
            group: 'operators.coreos.com',
            version: 'v1alpha1',
            kind: 'Subscription',
          }}
          name={obj.metadata?.name}
          namespace={obj.metadata?.namespace}
        />
      </TableData>
      <TableData id="namespace" activeColumnIDs={activeColumnIDs}>
        <ResourceLink kind="Namespace" name={obj.metadata?.namespace} />
      </TableData>
      <TableData id="status" activeColumnIDs={activeColumnIDs}>
        {statusLabel(state)}
      </TableData>
      <TableData id="package" activeColumnIDs={activeColumnIDs}>
        {sub?.spec?.name || '-'}
      </TableData>
      <TableData id="channel" activeColumnIDs={activeColumnIDs}>
        {sub?.spec?.channel || '-'}
      </TableData>
      <TableData id="installedCSV" activeColumnIDs={activeColumnIDs}>
        {installedCSV !== '-' ? (
          <ResourceLink
            groupVersionKind={{
              group: 'operators.coreos.com',
              version: 'v1alpha1',
              kind: 'ClusterServiceVersion',
            }}
            name={installedCSV}
            namespace={obj.metadata?.namespace}
          />
        ) : (
          '-'
        )}
      </TableData>
      <TableData id="approval" activeColumnIDs={activeColumnIDs}>
        <Label
          color={sub?.spec?.installPlanApproval === 'Automatic' ? 'green' : 'orange'}
          isCompact
          variant="outline"
        >
          {sub?.spec?.installPlanApproval || '-'}
        </Label>
      </TableData>
      <TableData id="created" activeColumnIDs={activeColumnIDs}>
        <Timestamp timestamp={obj.metadata?.creationTimestamp} />
      </TableData>
    </>
  );
};

export const SubscriptionsPage: FC<any> = () => {
  const { t } = useTranslation();
  const [activeNamespace] = useActiveNamespace();

  const [subs, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>({
    groupVersionKind: {
      group: 'operators.coreos.com',
      version: 'v1alpha1',
      kind: 'Subscription',
    },
    isList: true,
    namespaced: true,
    ...(activeNamespace && activeNamespace !== '#ALL_NS#'
      ? { namespace: activeNamespace }
      : {}),
  });

  const [data, filteredData, onFilterChange] = useListPageFilter(subs);

  return (
    <>
      <ListPageHeader title={t('olm~Subscriptions')} />
      <ListPageBody>
        <ListPageFilter
          data={data}
          loaded={loaded}
          onFilterChange={onFilterChange}
        />
        <VirtualizedTable<K8sResourceCommon>
          data={filteredData}
          unfilteredData={data}
          loaded={loaded}
          loadError={loadError}
          columns={columns}
          Row={SubscriptionRow}
        />
      </ListPageBody>
    </>
  );
};

export default SubscriptionsPage;

// Placeholder details page
export const SubscriptionDetailsPage = SubscriptionsPage;
