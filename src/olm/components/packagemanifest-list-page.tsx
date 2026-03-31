/**
 * Minimal PackageManifest list page using SDK components directly.
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
  useActiveNamespace,
} from '@openshift-console/dynamic-plugin-sdk';
import type {
  K8sResourceCommon,
  TableColumn,
  RowProps,
} from '@openshift-console/dynamic-plugin-sdk';

const columns: TableColumn<K8sResourceCommon>[] = [
  { title: 'Name', id: 'name', sortField: 'metadata.name' },
  { title: 'Catalog Source', id: 'catalogSource' },
  { title: 'Publisher', id: 'publisher' },
  { title: 'Default Channel', id: 'defaultChannel' },
];

const PackageManifestRow: FC<RowProps<K8sResourceCommon>> = ({ obj, activeColumnIDs }) => (
  <>
    <TableData id="name" activeColumnIDs={activeColumnIDs}>
      <ResourceLink
        groupVersionKind={{
          group: 'packages.operators.coreos.com',
          version: 'v1',
          kind: 'PackageManifest',
        }}
        name={obj.metadata?.name}
        namespace={obj.metadata?.namespace}
      />
    </TableData>
    <TableData id="catalogSource" activeColumnIDs={activeColumnIDs}>
      {(obj as any)?.status?.catalogSource || '-'}
    </TableData>
    <TableData id="publisher" activeColumnIDs={activeColumnIDs}>
      {(obj as any)?.status?.provider?.name || '-'}
    </TableData>
    <TableData id="defaultChannel" activeColumnIDs={activeColumnIDs}>
      {(obj as any)?.status?.defaultChannel || '-'}
    </TableData>
  </>
);

export const PackageManifestsPage: FC<any> = () => {
  const { t } = useTranslation();
  const [activeNamespace] = useActiveNamespace();

  const [pkgs, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>({
    groupVersionKind: {
      group: 'packages.operators.coreos.com',
      version: 'v1',
      kind: 'PackageManifest',
    },
    isList: true,
    namespaced: true,
    ...(activeNamespace && activeNamespace !== '#ALL_NS#'
      ? { namespace: activeNamespace }
      : {}),
  });

  const [data, filteredData, onFilterChange] = useListPageFilter(pkgs);

  return (
    <>
      <ListPageHeader title={t('olm~Package Manifests')} />
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
          Row={PackageManifestRow}
        />
      </ListPageBody>
    </>
  );
};

export default PackageManifestsPage;
