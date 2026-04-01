/**
 * InstallPlan list page with color-coded phase and approval status.
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
  BanIcon,
} from '@patternfly/react-icons';

const columns: TableColumn<K8sResourceCommon>[] = [
  { title: 'Name', id: 'name', sort: 'metadata.name' },
  { title: 'Namespace', id: 'namespace', sort: 'metadata.namespace' },
  { title: 'Components', id: 'components' },
  { title: 'Approval', id: 'approval' },
  { title: 'Approved', id: 'approved' },
  { title: 'Phase', id: 'phase' },
  { title: 'Created', id: 'created', sort: 'metadata.creationTimestamp' },
];

const phaseLabel = (phase: string) => {
  switch (phase) {
    case 'Complete':
      return (
        <Label color="green" icon={<CheckCircleIcon />} isCompact>
          Complete
        </Label>
      );
    case 'Installing':
      return (
        <Label color="blue" icon={<InProgressIcon />} isCompact>
          Installing
        </Label>
      );
    case 'RequiresApproval':
      return (
        <Label color="orange" icon={<InProgressIcon />} isCompact>
          Requires approval
        </Label>
      );
    case 'Failed':
      return (
        <Label color="red" icon={<ExclamationCircleIcon />} isCompact>
          Failed
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

const InstallPlanRow: FC<RowProps<K8sResourceCommon>> = ({ obj, activeColumnIDs }) => {
  const plan = obj as any;
  const approved = plan?.spec?.approved;
  const clusterServiceVersionNames =
    plan?.spec?.clusterServiceVersionNames?.join(', ') || '-';

  return (
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
      <TableData id="components" activeColumnIDs={activeColumnIDs}>
        <span style={{ fontSize: '0.85rem' }}>{clusterServiceVersionNames}</span>
      </TableData>
      <TableData id="approval" activeColumnIDs={activeColumnIDs}>
        <Label
          color={plan?.spec?.approval === 'Automatic' ? 'green' : 'orange'}
          isCompact
          variant="outline"
        >
          {plan?.spec?.approval || '-'}
        </Label>
      </TableData>
      <TableData id="approved" activeColumnIDs={activeColumnIDs}>
        {approved === true ? (
          <CheckCircleIcon style={{ color: 'var(--pf-t--global--color--status--success--default, #3e8635)' }} />
        ) : approved === false ? (
          <BanIcon style={{ color: 'var(--pf-t--global--color--status--danger--default, #c9190b)' }} />
        ) : (
          '-'
        )}
      </TableData>
      <TableData id="phase" activeColumnIDs={activeColumnIDs}>
        {phaseLabel(plan?.status?.phase)}
      </TableData>
      <TableData id="created" activeColumnIDs={activeColumnIDs}>
        <Timestamp timestamp={obj.metadata?.creationTimestamp} />
      </TableData>
    </>
  );
};

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
