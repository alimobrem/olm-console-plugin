/**
 * Minimal InstallPlan list page using SDK components directly.
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
  { title: 'Approval', id: 'approval' },
  { title: 'Phase', id: 'phase' },
  { title: 'Created', id: 'created', sortField: 'metadata.creationTimestamp' },
];

const InstallPlanRow: FC<RowProps<K8sResourceCommon>> = ({ obj, activeColumnIDs }) => (
  <>
    <TableData id="name" activeColumnIDs={activeColumnIDs}>
      <ResourceLink
        groupVersionKind={{
          group: 'operators.coreos.com',
          version: 'v1alpha1',
          kind: 'InstallPlan',
        }}
        name={obj.metadata?.name}
        namespace={obj.metadata?.namespace}
      />
    </TableData>
    <TableData id="namespace" activeColumnIDs={activeColumnIDs}>
      <ResourceLink kind="Namespace" name={obj.metadata?.namespace} />
    </TableData>
    <TableData id="approval" activeColumnIDs={activeColumnIDs}>
      {(obj as any)?.spec?.approval || '-'}
    </TableData>
    <TableData id="phase" activeColumnIDs={activeColumnIDs}>
      {(obj as any)?.status?.phase || '-'}
    </TableData>
    <TableData id="created" activeColumnIDs={activeColumnIDs}>
      <Timestamp timestamp={obj.metadata?.creationTimestamp} />
    </TableData>
  </>
);

export const InstallPlansPage: FC<any> = () => {
  const { t } = useTranslation();
  const [activeNamespace] = useActiveNamespace();

  const [plans, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>({
    groupVersionKind: {
      group: 'operators.coreos.com',
      version: 'v1alpha1',
      kind: 'InstallPlan',
    },
    isList: true,
    namespaced: true,
    ...(activeNamespace && activeNamespace !== '#ALL_NS#'
      ? { namespace: activeNamespace }
      : {}),
  });

  const [data, filteredData, onFilterChange] = useListPageFilter(plans);

  return (
    <>
      <ListPageHeader title={t('olm~Install Plans')} />
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
          Row={InstallPlanRow}
        />
      </ListPageBody>
    </>
  );
};

export default InstallPlansPage;

// Placeholder details page
export const InstallPlanDetailsPage = InstallPlansPage;
