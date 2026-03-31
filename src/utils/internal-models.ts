/**
 * K8s model definitions that were previously imported from @console/internal/models.
 * These are not available in the dynamic plugin SDK, so we define them inline.
 */
import type { K8sModel } from '@openshift-console/dynamic-plugin-sdk';

export const ServiceAccountModel: K8sModel = {
  kind: 'ServiceAccount',
  label: 'ServiceAccount',
  labelPlural: 'ServiceAccounts',
  apiVersion: 'v1',
  abbr: 'SA',
  namespaced: true,
  plural: 'serviceaccounts',
};

export const NamespaceModel: K8sModel = {
  kind: 'Namespace',
  label: 'Namespace',
  labelPlural: 'Namespaces',
  apiVersion: 'v1',
  abbr: 'NS',
  namespaced: false,
  plural: 'namespaces',
};

export const CustomResourceDefinitionModel: K8sModel = {
  kind: 'CustomResourceDefinition',
  label: 'CustomResourceDefinition',
  labelPlural: 'CustomResourceDefinitions',
  apiGroup: 'apiextensions.k8s.io',
  apiVersion: 'v1',
  abbr: 'CRD',
  namespaced: false,
  plural: 'customresourcedefinitions',
};

export const ConfigMapModel: K8sModel = {
  kind: 'ConfigMap',
  label: 'ConfigMap',
  labelPlural: 'ConfigMaps',
  apiVersion: 'v1',
  abbr: 'CM',
  namespaced: true,
  plural: 'configmaps',
};

export const SecretModel: K8sModel = {
  kind: 'Secret',
  label: 'Secret',
  labelPlural: 'Secrets',
  apiVersion: 'v1',
  abbr: 'S',
  namespaced: true,
  plural: 'secrets',
};

export const RoleBindingModel: K8sModel = {
  kind: 'RoleBinding',
  label: 'RoleBinding',
  labelPlural: 'RoleBindings',
  apiGroup: 'rbac.authorization.k8s.io',
  apiVersion: 'v1',
  abbr: 'RB',
  namespaced: true,
  plural: 'rolebindings',
};

export const ClusterRoleModel: K8sModel = {
  kind: 'ClusterRole',
  label: 'ClusterRole',
  labelPlural: 'ClusterRoles',
  apiGroup: 'rbac.authorization.k8s.io',
  apiVersion: 'v1',
  abbr: 'CR',
  namespaced: false,
  plural: 'clusterroles',
};

export const DeploymentModel: K8sModel = {
  kind: 'Deployment',
  label: 'Deployment',
  labelPlural: 'Deployments',
  apiGroup: 'apps',
  apiVersion: 'v1',
  abbr: 'D',
  namespaced: true,
  plural: 'deployments',
};

export const ConsoleOperatorConfigModel: K8sModel = {
  kind: 'Console',
  label: 'Console',
  labelPlural: 'Consoles',
  apiGroup: 'operator.openshift.io',
  apiVersion: 'v1',
  abbr: 'CO',
  namespaced: false,
  plural: 'consoles',
};

export { InfrastructureModel, AuthenticationModel, CloudCredentialModel } from './k8s-shims';
