// Constants previously imported from @console/shared/src/constants

export const ALL_NAMESPACES_KEY = '#ALL_NS#';
export const LAST_NAMESPACE_NAME_LOCAL_STORAGE_KEY = 'bridge/last-namespace-name';
export const USERSETTINGS_PREFIX = 'console';
export const COLUMN_MANAGEMENT_CONFIGMAP_KEY = 'console.tableColumns';
export const COLUMN_MANAGEMENT_LOCAL_STORAGE_KEY = 'bridge/table-columns';

// Time constants
export const MILLISECONDS = 1;
export const SECONDS = 1000 * MILLISECONDS;
export const ONE_SECOND = SECONDS;
export const MINUTES = 60 * SECONDS;
export const HOURS = 60 * MINUTES;

// UI constants
export const DASH = '-';

// Console config
export const CONSOLE_OPERATOR_CONFIG_NAME = 'cluster';

// Feature flags — matches @console/internal/reducers/features
export const FLAGS = {
  OPENSHIFT: 'OPENSHIFT',
  CAN_CREATE_NS: 'CAN_CREATE_NS',
  CAN_CREATE_PROJECT: 'CAN_CREATE_PROJECT',
  CAN_LIST_NS: 'CAN_LIST_NS',
  CAN_LIST_NODE: 'CAN_LIST_NODE',
  CAN_LIST_STORE: 'CAN_LIST_STORE',
  CAN_LIST_CRD: 'CAN_LIST_CRD',
  CAN_LIST_PACKAGE_MANIFEST: 'CAN_LIST_PACKAGE_MANIFEST',
  CAN_LIST_OPERATOR_GROUP: 'CAN_LIST_OPERATOR_GROUP',
  SHOW_OPENSHIFT_START_GUIDE: 'SHOW_OPENSHIFT_START_GUIDE',
  CLUSTER_AUTOSCALER: 'CLUSTER_AUTOSCALER',
  MACHINE_AUTOSCALER: 'MACHINE_AUTOSCALER',
  MACHINE_CONFIG: 'MACHINE_CONFIG',
  CLUSTER_API: 'CLUSTER_API',
  MACHINE_HEALTH_CHECK: 'MACHINE_HEALTH_CHECK',
} as const;
