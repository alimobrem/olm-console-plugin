/**
 * Compatibility shims for @console/internal/module/k8s functions
 * that don't have direct SDK equivalents.
 *
 * Also re-exports SDK functions so consumers can import from one place.
 */
import type { K8sModel, K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';

import {
  k8sGet as sdkK8sGet,
  k8sCreate as sdkK8sCreate,
  k8sUpdate as sdkK8sUpdate,
  k8sPatch as sdkK8sPatch,
  k8sDelete as sdkK8sDelete,
  k8sList as sdkK8sList,
} from '@openshift-console/dynamic-plugin-sdk';

export {
  useK8sWatchResource,
  useK8sWatchResources,
  useK8sModel,
  useK8sModels,
} from '@openshift-console/dynamic-plugin-sdk';

// Backward-compat: old OLM code calls k8sPatch(model, resource, patches) but the SDK
// takes a single options object. These wrappers detect the calling convention at runtime.
const wrapK8s = (sdkFn: (opts: any) => any, argMapper: (...a: any[]) => any) =>
  (...args: any[]): any => args.length === 1 ? sdkFn(args[0]) : sdkFn(argMapper(...args));

export const k8sPatch = wrapK8s(sdkK8sPatch, (model, resource, data) => ({ model, resource, data }));
export const k8sGet = wrapK8s(sdkK8sGet, (model, name, ns) => ({ model, name, ns }));
export const k8sCreate = wrapK8s(sdkK8sCreate, (model, data) => ({ model, data }));
export const k8sUpdate = wrapK8s(sdkK8sUpdate, (model, data) => ({ model, data }));
export const k8sList = wrapK8s(sdkK8sList, (model, params) => ({ model, queryParams: params }));

// k8sDelete has special handling for deleteOptions in the 5th argument
export const k8sDelete = (...args: any[]): any => {
  if (args.length === 1) return sdkK8sDelete(args[0]);
  const [model, resource, , , deleteOptions] = args;
  return sdkK8sDelete({
    model,
    resource,
    ...(deleteOptions ? { requestInit: { body: JSON.stringify(deleteOptions) } } : {}),
  });
};

export const k8sKill = k8sDelete;
export const k8sListPartialMetadata = k8sList;

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

// Types needed by various OLM components
export type ObjectMetadata = K8sResourceCommon['metadata'];

// WatchK8sResult type for useK8sWatchResource results
export type WatchK8sResult<T> = [T, boolean, any];

export type OwnerReference = {
  apiVersion: string;
  kind: string;
  name: string;
  uid: string;
  controller?: boolean;
  blockOwnerDeletion?: boolean;
};

export type NodeAffinity = {
  requiredDuringSchedulingIgnoredDuringExecution?: {
    nodeSelectorTerms: Array<{
      matchExpressions?: Array<{ key: string; operator: string; values?: string[] }>;
      matchFields?: Array<{ key: string; operator: string; values?: string[] }>;
    }>;
  };
  preferredDuringSchedulingIgnoredDuringExecution?: Array<{
    weight: number;
    preference: {
      matchExpressions?: Array<{ key: string; operator: string; values?: string[] }>;
      matchFields?: Array<{ key: string; operator: string; values?: string[] }>;
    };
  }>;
};

export type PodAffinityTerm = {
  labelSelector?: { matchLabels?: Record<string, string>; matchExpressions?: Array<{ key: string; operator: string; values?: string[] }> };
  namespaces?: string[];
  topologyKey: string;
};

export type PodAffinity = {
  requiredDuringSchedulingIgnoredDuringExecution?: PodAffinityTerm[];
  preferredDuringSchedulingIgnoredDuringExecution?: Array<{
    weight: number;
    podAffinityTerm: PodAffinityTerm;
  }>;
};

export enum Operator {
  Exists = 'Exists',
  DoesNotExist = 'DoesNotExist',
  In = 'In',
  NotIn = 'NotIn',
  Equals = 'Equals',
  NotEquals = 'NotEquals',
  GreaterThan = 'GreaterThan',
  LessThan = 'LessThan',
}

export enum ImagePullPolicy {
  Always = 'Always',
  IfNotPresent = 'IfNotPresent',
  Never = 'Never',
}

export type CustomResourceDefinitionKind = K8sResourceCommon & {
  spec: {
    group: string;
    versions: Array<{
      name: string;
      served: boolean;
      storage: boolean;
      schema?: { openAPIV3Schema?: Record<string, unknown> };
    }>;
    names: { plural: string; singular: string; kind: string; shortNames?: string[] };
    scope: 'Namespaced' | 'Cluster';
  };
};

export type InfrastructureKind = K8sResourceCommon & { status?: { platform?: string; infrastructureName?: string } };
export type CloudCredentialKind = K8sResourceCommon & { spec?: { credentialsMode?: string } };
export type AuthenticationKind = K8sResourceCommon & { spec?: { serviceAccountIssuer?: string } };

/**
 * Extract group from a reference string (e.g., "apps~v1~Deployment" → "apps").
 */
export const apiGroupForReference = (ref: string): string => {
  const parts = ref.split('~');
  return parts.length >= 3 ? parts[0] : '';
};

/**
 * Extract version from a reference string (e.g., "apps~v1~Deployment" → "v1").
 */
export const apiVersionForReference = (ref: string): string => {
  const parts = ref.split('~');
  return parts.length >= 3 ? parts[1] : parts[0] || 'v1';
};

/**
 * Build a reference string from an owner reference.
 */
export const referenceForOwnerRef = (ownerRef: OwnerReference): string => {
  const group = ownerRef.apiVersion?.includes('/') ? ownerRef.apiVersion.split('/')[0] : '';
  const version = ownerRef.apiVersion?.includes('/')
    ? ownerRef.apiVersion.split('/')[1]
    : ownerRef.apiVersion || '';
  return group ? `${group}~${version}~${ownerRef.kind}` : ownerRef.kind;
};

/**
 * Look up a CRD property definition by path.
 * Stub for `definitionFor` from @console/internal.
 */
export const definitionFor = (
  _model: K8sModel,
): CustomResourceDefinitionKind | undefined => undefined;

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
 * Supports both curried `(group)(version)(kind)` and direct `(group, version, kind)` forms.
 */
export const referenceForGroupVersionKind =
  (group: string, version?: string, kind?: string): any => {
    if (version !== undefined && kind !== undefined) {
      return group ? `${group}~${version}~${kind}` : kind;
    }
    // Curried form: returns (version) => (kind) => string
    return (v: string) => (k: string) => (group ? `${group}~${v}~${k}` : k);
  };

/**
 * Build a reference string from a K8sModel.
 * Replaces `referenceForModel` from @console/internal/module/k8s
 */
export const referenceForModel = (model: K8sModel): string =>
  referenceForGroupVersionKind(model.apiGroup || '', model.apiVersion, model.kind);

/**
 * Get the apiVersion string for a K8sModel.
 * Replaces `apiVersionForModel` from @console/internal/module/k8s
 */
export const apiVersionForModel = (model: K8sModel): string =>
  model.apiGroup ? `${model.apiGroup}/${model.apiVersion}` : model.apiVersion;

/**
 * Get the kind from a reference string.
 * Replaces `kindForReference` from @console/internal/module/k8s
 */
export const kindForReference = (ref: string): string => ref.split('~').pop() || ref;

/**
 * Look up a K8sModel by reference string.
 * In the console host, this queries the global model store. In standalone mode,
 * we return a synthetic model with naive pluralization (kind + "s") — this won't
 * handle irregular plurals but suffices for CRD-based resources.
 */
export const modelFor = (ref: string): K8sModel | undefined => {
  if (!ref) return undefined;
  const parts = ref.split('~');
  if (parts.length >= 3) {
    const [group, version, kind] = parts;
    return {
      apiGroup: group,
      apiVersion: version,
      kind,
      plural: `${kind.toLowerCase()}s`,
      label: kind,
      labelPlural: `${kind}s`,
      abbr: kind.substring(0, 2).toUpperCase(),
      namespaced: true,
      crd: true,
    } as K8sModel;
  }
  return {
    apiGroup: '',
    apiVersion: 'v1',
    kind: ref,
    plural: `${ref.toLowerCase()}s`,
    label: ref,
    labelPlural: `${ref}s`,
    abbr: ref.substring(0, 2).toUpperCase(),
    namespaced: true,
  } as K8sModel;
};

/**
 * Get the name for a model (group/plural form).
 * Replaces `nameForModel` from @console/internal/module/k8s
 */
export const nameForModel = (model: K8sModel): string =>
  model.apiGroup ? `${model.apiGroup}/${model.plural}` : model.plural;

/**
 * Build a K8s API URL for a resource.
 * Replaces `resourceURL` from @console/internal/module/k8s
 */
export const resourceURL = (
  model: K8sModel,
  options?: { ns?: string; name?: string; path?: string; queryParams?: Record<string, string> },
): string => {
  const { ns, name, path, queryParams } = options || {};
  let url = model.apiGroup
    ? `/apis/${model.apiGroup}/${model.apiVersion}`
    : `/api/${model.apiVersion}`;
  if (ns) url += `/namespaces/${ns}`;
  url += `/${model.plural}`;
  if (name) url += `/${name}`;
  if (path) url += `/${path}`;
  if (queryParams) {
    const qs = new URLSearchParams(queryParams).toString();
    if (qs) url += `?${qs}`;
  }
  return url;
};

/**
 * Compare API versions for sorting (e.g., v1 > v1beta1 > v1alpha1).
 * Replaces `apiVersionCompare` from @console/internal/module/k8s
 */
const VERSION_REGEX = /^v(\d+)(?:(alpha|beta)(\d+)?)?$/;
const STABILITY_ORDER: Record<string, number> = { alpha: 0, beta: 1 };

export const apiVersionCompare = (a: string, b: string): number => {
  if (a === b) return 0;
  const aMatch = a?.match(VERSION_REGEX);
  const bMatch = b?.match(VERSION_REGEX);
  if (!aMatch && !bMatch) return a?.localeCompare(b) || 0;
  if (!aMatch) return 1;
  if (!bMatch) return -1;
  const aMajor = parseInt(aMatch[1], 10);
  const bMajor = parseInt(bMatch[1], 10);
  if (aMajor !== bMajor) return aMajor - bMajor;
  const aStability = aMatch[2] ? STABILITY_ORDER[aMatch[2]] ?? 0 : 2;
  const bStability = bMatch[2] ? STABILITY_ORDER[bMatch[2]] ?? 0 : 2;
  if (aStability !== bStability) return aStability - bStability;
  const aMinor = parseInt(aMatch[3] || '0', 10);
  const bMinor = parseInt(bMatch[3] || '0', 10);
  return aMinor - bMinor;
};

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
  subresource?: string,
): { group: string; resource: string; namespace?: string; name?: string; verb: any } => ({
  group: model.apiGroup || '',
  resource: subresource ? `${model.plural}/${subresource}` : model.plural,
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
