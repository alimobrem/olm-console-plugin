/**
 * Minimal Subscription list page using SDK components directly.
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

const columns: TableColumn<K8sResourceCommon>[] = [
  { title: 'Name', id: 'name', sortField: 'metadata.name' },
  { title: 'Namespace', id: 'namespace', sortField: 'metadata.namespace' },
  { title: 'Package', id: 'package' },
  { title: 'Channel', id: 'channel' },
  { title: 'Approval Strategy', id: 'approval' },
  { title: 'Created', id: 'created', sortField: 'metadata.creationTimestamp' },
];

const SubscriptionRow: FC<RowProps<K8sResourceCommon>> = ({ obj, activeColumnIDs }) => (
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
    <TableData id="package" activeColumnIDs={activeColumnIDs}>
      {(obj as any)?.spec?.name || '-'}
    </TableData>
    <TableData id="channel" activeColumnIDs={activeColumnIDs}>
      {(obj as any)?.spec?.channel || '-'}
    </TableData>
    <TableData id="approval" activeColumnIDs={activeColumnIDs}>
      {(obj as any)?.spec?.installPlanApproval || '-'}
    </TableData>
    <TableData id="created" activeColumnIDs={activeColumnIDs}>
      <Timestamp timestamp={obj.metadata?.creationTimestamp} />
    </TableData>
  </>
);

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
