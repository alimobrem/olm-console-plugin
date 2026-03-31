/**
 * Minimal ClusterServiceVersion list page using SDK components directly.
 * Bypasses legacy factory wrappers to verify runtime functionality.
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
  { title: 'Version', id: 'version' },
  { title: 'Phase', id: 'phase' },
  { title: 'Created', id: 'created', sortField: 'metadata.creationTimestamp' },
];

const CSVRow: FC<RowProps<K8sResourceCommon>> = ({ obj, activeColumnIDs }) => (
  <>
    <TableData id="name" activeColumnIDs={activeColumnIDs}>
      <ResourceLink
        groupVersionKind={{
          group: 'operators.coreos.com',
          version: 'v1alpha1',
          kind: 'ClusterServiceVersion',
        }}
        name={obj.metadata?.name}
        namespace={obj.metadata?.namespace}
      />
    </TableData>
    <TableData id="namespace" activeColumnIDs={activeColumnIDs}>
      <ResourceLink kind="Namespace" name={obj.metadata?.namespace} />
    </TableData>
    <TableData id="version" activeColumnIDs={activeColumnIDs}>
      {(obj as any)?.spec?.version || '-'}
    </TableData>
    <TableData id="phase" activeColumnIDs={activeColumnIDs}>
      {(obj as any)?.status?.phase || '-'}
    </TableData>
    <TableData id="created" activeColumnIDs={activeColumnIDs}>
      <Timestamp timestamp={obj.metadata?.creationTimestamp} />
    </TableData>
  </>
);

export const ClusterServiceVersionsPage: FC<any> = () => {
  const { t } = useTranslation();
  const [activeNamespace] = useActiveNamespace();

  const [csvs, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>({
    groupVersionKind: {
      group: 'operators.coreos.com',
      version: 'v1alpha1',
      kind: 'ClusterServiceVersion',
    },
    isList: true,
    namespaced: true,
    ...(activeNamespace && activeNamespace !== '#ALL_NS#'
      ? { namespace: activeNamespace }
      : {}),
  });

  const [data, filteredData, onFilterChange] = useListPageFilter(csvs);

  return (
    <>
      <ListPageHeader title={t('olm~Installed Operators')} />
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
          Row={CSVRow}
        />
      </ListPageBody>
    </>
  );
};

export default ClusterServiceVersionsPage;

// Placeholder details page — renders the same list for now
export const ClusterServiceVersionDetailsPage = ClusterServiceVersionsPage;
