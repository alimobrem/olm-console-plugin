import * as _ from 'lodash';
import type {
  K8sResourceCommon,
} from '@openshift-console/dynamic-plugin-sdk';

// These types/enums are not exported by the SDK at runtime, so we define them inline.
enum HealthState {
  OK = 'OK',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  PROGRESS = 'PROGRESS',
  UPDATING = 'UPDATING',
  UPGRADABLE = 'UPGRADABLE',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
  UNKNOWN = 'UNKNOWN',
  LOADING = 'LOADING',
}

type OperatorStatusPriority = {
  title: string;
  priority: number;
  health: HealthState | string;
};

type GetOperatorsWithStatuses<R extends K8sResourceCommon = K8sResourceCommon> = (
  resources: any,
) => { status: OperatorStatusPriority; operators: R[] }[];

const healthStateMapping: Record<string, { title: string; priority: number; health: string }> = {
  [HealthState.OK]: { title: 'Healthy', priority: 0, health: HealthState.OK },
  [HealthState.UNKNOWN]: { title: 'Unknown', priority: 1, health: HealthState.UNKNOWN },
  [HealthState.PROGRESS]: { title: 'Pending', priority: 2, health: HealthState.PROGRESS },
  [HealthState.UPDATING]: { title: 'Updating', priority: 3, health: HealthState.UPDATING },
  [HealthState.UPGRADABLE]: { title: 'Upgrade available', priority: 4, health: HealthState.UPGRADABLE },
  [HealthState.WARNING]: { title: 'Degraded', priority: 5, health: HealthState.WARNING },
  [HealthState.ERROR]: { title: 'Degraded', priority: 6, health: HealthState.ERROR },
  [HealthState.NOT_AVAILABLE]: { title: 'Not available', priority: 7, health: HealthState.NOT_AVAILABLE },
  [HealthState.LOADING]: { title: 'Loading', priority: 8, health: HealthState.LOADING },
};

type GetOperatorStatusPriority<R extends K8sResourceCommon> = (resource: R) => OperatorStatusPriority;
type OperatorStatusWithResources<R extends K8sResourceCommon> = {
  status: OperatorStatusPriority;
  operators: R[];
};

const getOperatorsStatus = <R extends K8sResourceCommon>(
  operators: R[],
  getOperatorStatusFn: GetOperatorStatusPriority<R>,
): OperatorStatusWithResources<R> => {
  if (!operators.length) {
    return {
      status: { ...healthStateMapping[HealthState.OK], title: 'Available' },
      operators: [],
    };
  }
  const operatorsByStatus: Record<string, OperatorStatusWithResources<R>> = operators.reduce(
    (acc, o) => {
      const status = getOperatorStatusFn(o);
      if (!acc[status.health]) {
        acc[status.health] = { status: { ...status }, operators: [o] };
      } else {
        acc[status.health].operators.push(o);
      }
      return acc;
    },
    {} as Record<string, OperatorStatusWithResources<R>>,
  );
  const mostImportantStatus = Object.keys(operatorsByStatus).sort(
    (a, b) => operatorsByStatus[b].status.priority - operatorsByStatus[a].status.priority,
  )[0];
  return operatorsByStatus[mostImportantStatus];
};
import { getSubscriptionStatus, getCSVStatus, subscriptionForCSV } from '../../status/csv-status';
import type { ClusterServiceVersionKind, SubscriptionKind } from '../../types';
import { SubscriptionState, ClusterServiceVersionStatus } from '../../types';

const getOperatorStatus = (
  subscriptionStatus: { status: SubscriptionState; title?: string },
  csvStatus: { status: ClusterServiceVersionStatus; title?: string },
): OperatorStatusPriority => {
  let operatorHealth: HealthState;
  switch (csvStatus.status) {
    case ClusterServiceVersionStatus.Failed:
      operatorHealth = HealthState.ERROR;
      break;
    case ClusterServiceVersionStatus.Pending:
      operatorHealth = HealthState.PROGRESS;
      break;
    case ClusterServiceVersionStatus.Unknown:
      operatorHealth = HealthState.UNKNOWN;
      break;
    default:
      operatorHealth = HealthState.OK;
  }
  if (
    operatorHealth !== HealthState.ERROR &&
    subscriptionStatus.status === SubscriptionState.SubscriptionStateUpgradePending
  ) {
    return {
      ...healthStateMapping[HealthState.UPDATING],
      title: subscriptionStatus.title,
    };
  }
  if (
    operatorHealth !== HealthState.ERROR &&
    subscriptionStatus.status === SubscriptionState.SubscriptionStateUpgradeAvailable
  ) {
    return {
      ...healthStateMapping[HealthState.UPGRADABLE],
      title: subscriptionStatus.title,
    };
  }
  return {
    ...healthStateMapping[operatorHealth],
    title: csvStatus.title,
  };
};

const getCSVPriorityStatus = (
  csv: ClusterServiceVersionKind,
  subscriptions: SubscriptionKind[],
): OperatorStatusPriority => {
  const subscriptionStatus = getSubscriptionStatus(subscriptionForCSV(subscriptions, csv));
  const csvStatus = getCSVStatus(csv);
  return getOperatorStatus(subscriptionStatus, csvStatus);
};

export const getClusterServiceVersionsWithStatuses: GetOperatorsWithStatuses<ClusterServiceVersionKind> = (
  resources,
) => {
  const grouppedOperators = _.groupBy(
    resources.clusterServiceVersions.data as ClusterServiceVersionKind[],
    (o) => o.metadata.name,
  );
  return _.values(grouppedOperators).map((operators) =>
    getOperatorsStatus<ClusterServiceVersionKind>(operators, (csv) =>
      getCSVPriorityStatus(csv, resources.subscriptions.data as SubscriptionKind[]),
    ),
  );
};
