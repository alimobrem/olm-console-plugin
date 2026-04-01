/**
 * Minimal CatalogSource list page using SDK components directly.
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
  { title: 'Name', id: 'name', sort: 'metadata.name' },
  { title: 'Namespace', id: 'namespace', sort: 'metadata.namespace' },
  { title: 'Display Name', id: 'displayName' },
  { title: 'Publisher', id: 'publisher' },
  { title: 'Type', id: 'type' },
  { title: 'Created', id: 'created', sort: 'metadata.creationTimestamp' },
];

const CatalogSourceRow: FC<RowProps<K8sResourceCommon>> = ({ obj, activeColumnIDs }) => (
  <>
    <TableData id="name" activeColumnIDs={activeColumnIDs}>
      <ResourceLink
        groupVersionKind={{
          group: 'operators.coreos.com',
          version: 'v1alpha1',
          kind: 'CatalogSource',
        }}
        name={obj.metadata?.name}
        namespace={obj.metadata?.namespace}
      />
    </TableData>
    <TableData id="namespace" activeColumnIDs={activeColumnIDs}>
      <ResourceLink kind="Namespace" name={obj.metadata?.namespace} />
    </TableData>
    <TableData id="displayName" activeColumnIDs={activeColumnIDs}>
      {(obj as any)?.spec?.displayName || '-'}
    </TableData>
    <TableData id="publisher" activeColumnIDs={activeColumnIDs}>
      {(obj as any)?.spec?.publisher || '-'}
    </TableData>
    <TableData id="type" activeColumnIDs={activeColumnIDs}>
      {(obj as any)?.spec?.sourceType || '-'}
    </TableData>
    <TableData id="created" activeColumnIDs={activeColumnIDs}>
      <Timestamp timestamp={obj.metadata?.creationTimestamp} />
    </TableData>
  </>
);

export const CatalogSourcesPage: FC<any> = () => {
  const { t } = useTranslation();
  const [activeNamespace] = useActiveNamespace();

  const [sources, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>({
    groupVersionKind: {
      group: 'operators.coreos.com',
      version: 'v1alpha1',
      kind: 'CatalogSource',
    },
    isList: true,
    namespaced: true,
    ...(activeNamespace && activeNamespace !== '#ALL_NS#'
      ? { namespace: activeNamespace }
      : {}),
  });

  const [data, filteredData, onFilterChange] = useListPageFilter(sources);

  return (
    <>
      <ListPageHeader title={t('olm~Catalog Sources')} />
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
          Row={CatalogSourceRow}
        />
      </ListPageBody>
    </>
  );
};

export default CatalogSourcesPage;

// Placeholder details page
export const CatalogSourceDetailsPage = CatalogSourcesPage;

// Placeholder create pages
export const CreateSubscriptionYAML: FC = () => <div>Create Subscription YAML placeholder</div>;
export const CreateCatalogSource: FC = () => <div>Create Catalog Source placeholder</div>;
