/**
 * ClusterServiceVersion list page with status badges and display names.
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
  { title: 'Managed Namespaces', id: 'managedNamespaces' },
  { title: 'Version', id: 'version' },
  { title: 'Status', id: 'phase' },
  { title: 'Created', id: 'created', sort: 'metadata.creationTimestamp' },
];

const phaseLabel = (phase: string) => {
  switch (phase) {
    case 'Succeeded':
      return (
        <Label color="green" icon={<CheckCircleIcon />} isCompact>
          Succeeded
        </Label>
      );
    case 'Failed':
      return (
        <Label color="red" icon={<ExclamationCircleIcon />} isCompact>
          Failed
        </Label>
      );
    case 'Pending':
    case 'InstallReady':
    case 'Installing':
      return (
        <Label color="yellow" icon={<InProgressIcon />} isCompact>
          {phase}
        </Label>
      );
    case 'Replacing':
    case 'Deleting':
      return (
        <Label color="orange" icon={<InProgressIcon />} isCompact>
          {phase}
        </Label>
      );
    default:
      return (
        <Label color="grey" isCompact>
          {phase || 'Unknown'}
        </Label>
      );
  }
};

const CSVRow: FC<RowProps<K8sResourceCommon>> = ({ obj, activeColumnIDs }) => {
  const csv = obj as any;
  const displayName = csv?.spec?.displayName || obj.metadata?.name || '-';
  const managedNamespaces =
    csv?.status?.reason === 'Copied'
      ? csv?.metadata?.namespace
      : csv?.spec?.installModes
          ?.filter((m: any) => m.supported)
          ?.map((m: any) => m.type)
          ?.join(', ') || '-';

  return (
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
          displayName={displayName}
        />
      </TableData>
      <TableData id="namespace" activeColumnIDs={activeColumnIDs}>
        <ResourceLink kind="Namespace" name={obj.metadata?.namespace} />
      </TableData>
      <TableData id="managedNamespaces" activeColumnIDs={activeColumnIDs}>
        {managedNamespaces}
      </TableData>
      <TableData id="version" activeColumnIDs={activeColumnIDs}>
        {csv?.spec?.version || '-'}
      </TableData>
      <TableData id="phase" activeColumnIDs={activeColumnIDs}>
        {phaseLabel(csv?.status?.phase)}
      </TableData>
      <TableData id="created" activeColumnIDs={activeColumnIDs}>
        <Timestamp timestamp={obj.metadata?.creationTimestamp} />
      </TableData>
    </>
  );
};

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

// Re-export details page from dedicated module
export { ClusterServiceVersionDetailsPage } from './csv-detail-page';
