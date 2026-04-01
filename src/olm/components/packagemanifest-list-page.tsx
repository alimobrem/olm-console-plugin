/**
 * PackageManifest list page with colored catalog source labels.
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
import { Label } from '@patternfly/react-core';

const columns: TableColumn<K8sResourceCommon>[] = [
  { title: 'Name', id: 'name', sort: 'metadata.name' },
  { title: 'Catalog Source', id: 'catalogSource' },
  { title: 'Publisher', id: 'publisher' },
  { title: 'Default Channel', id: 'defaultChannel' },
];

/** Map catalog source to label color */
const catalogColor = (source: string): 'blue' | 'green' | 'orange' | 'purple' | 'grey' => {
  if (source?.includes('redhat')) return 'blue';
  if (source?.includes('certified')) return 'green';
  if (source?.includes('community')) return 'orange';
  if (source?.includes('marketplace')) return 'purple';
  return 'grey';
};

const PackageManifestRow: FC<RowProps<K8sResourceCommon>> = ({ obj, activeColumnIDs }) => {
  const pkg = obj as any;
  const catalogSource = pkg?.status?.catalogSource || '-';
  const catalogDisplayName = pkg?.status?.catalogSourceDisplayName || catalogSource;

  return (
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
        <Label color={catalogColor(catalogSource)} isCompact>
          {catalogDisplayName}
        </Label>
      </TableData>
      <TableData id="publisher" activeColumnIDs={activeColumnIDs}>
        {pkg?.status?.provider?.name || '-'}
      </TableData>
      <TableData id="defaultChannel" activeColumnIDs={activeColumnIDs}>
        <Label color="grey" isCompact variant="outline">
          {pkg?.status?.defaultChannel || '-'}
        </Label>
      </TableData>
    </>
  );
};

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
