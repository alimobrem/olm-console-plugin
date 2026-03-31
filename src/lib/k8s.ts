/**
 * Compatibility shims for @console/internal/module/k8s functions
 * that don't have direct SDK equivalents.
 *
 * Also re-exports SDK functions so consumers can import from one place.
 */
import type { K8sModel, K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';

// Re-export SDK k8s functions so consumers can import from one place
export {
  k8sGet,
  k8sCreate,
  k8sUpdate,
  k8sPatch,
  k8sDelete,
  k8sList,
  k8sListResourceItems,
  useK8sWatchResource,
  useK8sWatchResources,
  useK8sModel,
  useK8sModels,
} from '@openshift-console/dynamic-plugin-sdk';

export type {
  K8sModel,
  K8sResourceCommon,
  K8sResourceCondition,
  ObjectReference,
  Selector,
  GroupVersionKind,
  Patch,
} from '@openshift-console/dynamic-plugin-sdk';

export type {
  K8sResourceKind,
  MatchExpression,
  UserInfo,
} from '@openshift-console/dynamic-plugin-sdk';

/**
 * Build a reference string from a K8s resource object.
 * Replaces `referenceFor` from @console/internal/module/k8s
 */
export const referenceFor = (obj: K8sResourceCommon): string => {
  const group = obj?.apiVersion?.includes('/') ? obj.apiVersion.split('/')[0] : '';
  const version = obj?.apiVersion?.includes('/')
    ? obj.apiVersion.split('/')[1]
    : obj?.apiVersion || '';
  return group ? `${group}~${version}~${obj?.kind}` : `${version}~${obj?.kind}`;
};

/**
 * Build a reference string from group, version, kind.
 * Replaces `referenceForGroupVersionKind` from @console/internal/module/k8s
 */
export const referenceForGroupVersionKind = (
  group: string,
  version: string,
  kind: string,
): string => (group ? `${group}~${version}~${kind}` : kind);

/**
 * Build a reference string from a K8sModel.
 * Replaces `referenceForModel` from @console/internal/module/k8s
 */
export const referenceForModel = (model: K8sModel): string =>
  referenceForGroupVersionKind(model.apiGroup || '', model.apiVersion, model.kind);

/**
 * Get the kind from a reference string.
 * Replaces `kindForReference` from @console/internal/module/k8s
 */
export const kindForReference = (ref: string): string => ref.split('~').pop() || ref;

/**
 * Get the name for a model (group/plural form).
 * Replaces `nameForModel` from @console/internal/module/k8s
 */
export const nameForModel = (model: K8sModel): string =>
  model.apiGroup ? `${model.apiGroup}/${model.plural}` : model.plural;

/**
 * Build a URL path for a K8s resource object.
 * Replaces `resourceObjPath` from @console/internal/components/utils
 */
export const resourceObjPath = (obj: K8sResourceCommon, kind: string): string => {
  const ns = obj?.metadata?.namespace;
  const name = obj?.metadata?.name;
  const ref = kind || referenceFor(obj);
  return ns ? `/k8s/ns/${ns}/${ref}/${name}` : `/k8s/cluster/${ref}/${name}`;
};

/**
 * Build a URL path for a K8s resource.
 * Replaces `resourcePath` from @console/internal/components/utils
 */
export const resourcePath = (kind: string, name?: string, namespace?: string): string => {
  let url = namespace ? `/k8s/ns/${namespace}/${kind}` : `/k8s/cluster/${kind}`;
  if (name) {
    url += `/${name}`;
  }
  return url;
};

/**
 * Build an access review object for checking permissions.
 * Replaces `asAccessReview` from @console/internal/components/utils/rbac
 */
export const asAccessReview = (
  model: K8sModel,
  obj: K8sResourceCommon,
  verb: string,
): { group: string; resource: string; namespace?: string; name?: string; verb: string } => ({
  group: model.apiGroup || '',
  resource: model.plural,
  namespace: obj?.metadata?.namespace,
  name: obj?.metadata?.name,
  verb,
});

/**
 * Simple label selector matching.
 * Replaces `LabelSelector` from @console/internal/module/k8s
 */
export class LabelSelector {
  private matchLabels: Record<string, string>;
  private matchExpressions: Array<{
    key: string;
    operator: string;
    values?: string[];
  }>;

  constructor(selector?: {
    matchLabels?: Record<string, string>;
    matchExpressions?: Array<{ key: string; operator: string; values?: string[] }>;
  }) {
    this.matchLabels = selector?.matchLabels || {};
    this.matchExpressions = selector?.matchExpressions || [];
  }

  matches(resource: K8sResourceCommon): boolean {
    const labels = resource?.metadata?.labels || {};

    // Check matchLabels
    for (const [key, value] of Object.entries(this.matchLabels)) {
      if (labels[key] !== value) return false;
    }

    // Check matchExpressions
    for (const expr of this.matchExpressions) {
      const labelValue = labels[expr.key];
      switch (expr.operator) {
        case 'In':
          if (!expr.values?.includes(labelValue)) return false;
          break;
        case 'NotIn':
          if (expr.values?.includes(labelValue)) return false;
          break;
        case 'Exists':
          if (!(expr.key in labels)) return false;
          break;
        case 'DoesNotExist':
          if (expr.key in labels) return false;
          break;
      }
    }

    return true;
  }
}

/**
 * Convert match expressions to a flat requirements array.
 * Replaces `fromRequirements` from @console/internal/module/k8s/selector
 */
export const fromRequirements = (
  requirements: Array<{ key: string; operator: string; values?: string[] }>,
): Record<string, string> => {
  const labels: Record<string, string> = {};
  requirements?.forEach((req) => {
    if (req.operator === 'Equals' || req.operator === 'In') {
      if (req.values?.length === 1) {
        labels[req.key] = req.values[0];
      }
    }
  });
  return labels;
};

/**
 * K8s model definitions for infrastructure models used by OLM.
 * These are not available in the SDK so we define them inline.
 */
export const InfrastructureModel: K8sModel = {
  kind: 'Infrastructure',
  label: 'Infrastructure',
  labelPlural: 'Infrastructures',
  apiGroup: 'config.openshift.io',
  apiVersion: 'v1',
  abbr: 'INF',
  namespaced: false,
  crd: false,
  plural: 'infrastructures',
};

export const AuthenticationModel: K8sModel = {
  kind: 'Authentication',
  label: 'Authentication',
  labelPlural: 'Authentications',
  apiGroup: 'config.openshift.io',
  apiVersion: 'v1',
  abbr: 'AU',
  namespaced: false,
  crd: false,
  plural: 'authentications',
};

export const CloudCredentialModel: K8sModel = {
  kind: 'CloudCredential',
  label: 'CloudCredential',
  labelPlural: 'CloudCredentials',
  apiGroup: 'operator.openshift.io',
  apiVersion: 'v1',
  abbr: 'CC',
  namespaced: false,
  crd: false,
  plural: 'cloudcredentials',
};
