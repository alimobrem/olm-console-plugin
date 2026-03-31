import type { K8sModel } from '@openshift-console/dynamic-plugin-sdk';

// OLMv0 Models

export const OperatorSourceModel: K8sModel = {
  kind: 'OperatorSource',
  label: 'OperatorSource',
  labelKey: 'olm~OperatorSource',
  labelPlural: 'OperatorSource',
  labelPluralKey: 'olm~OperatorSource',
  apiGroup: 'operators.coreos.com',
  apiVersion: 'v1',
  abbr: 'OSRC',
  namespaced: true,
  crd: true,
  plural: 'operatorsources',
};

export const CatalogSourceModel: K8sModel = {
  kind: 'CatalogSource',
  label: 'CatalogSource',
  labelKey: 'olm~CatalogSource',
  labelPlural: 'CatalogSources',
  labelPluralKey: 'olm~CatalogSources',
  apiGroup: 'operators.coreos.com',
  apiVersion: 'v1alpha1',
  abbr: 'CS',
  namespaced: true,
  crd: true,
  plural: 'catalogsources',
};

export const PackageManifestModel: K8sModel = {
  kind: 'PackageManifest',
  label: 'PackageManifest',
  labelKey: 'olm~PackageManifest',
  labelPlural: 'PackageManifests',
  labelPluralKey: 'olm~PackageManifests',
  apiGroup: 'packages.operators.coreos.com',
  apiVersion: 'v1',
  abbr: 'PM',
  namespaced: true,
  crd: true,
  plural: 'packagemanifests',
};

export const ClusterServiceVersionModel: K8sModel = {
  kind: 'ClusterServiceVersion',
  label: 'ClusterServiceVersion',
  labelKey: 'olm~ClusterServiceVersion',
  labelPlural: 'ClusterServiceVersions',
  labelPluralKey: 'olm~ClusterServiceVersions',
  apiGroup: 'operators.coreos.com',
  apiVersion: 'v1alpha1',
  abbr: 'CSV',
  namespaced: true,
  crd: true,
  plural: 'clusterserviceversions',
  propagationPolicy: 'Foreground',
  legacyPluralURL: true,
};

export const InstallPlanModel: K8sModel = {
  kind: 'InstallPlan',
  label: 'InstallPlan',
  labelKey: 'olm~InstallPlan',
  labelPlural: 'InstallPlans',
  labelPluralKey: 'olm~InstallPlans',
  apiGroup: 'operators.coreos.com',
  apiVersion: 'v1alpha1',
  abbr: 'IP',
  namespaced: true,
  crd: true,
  plural: 'installplans',
  legacyPluralURL: true,
};

export const SubscriptionModel: K8sModel = {
  kind: 'Subscription',
  label: 'Subscription',
  labelKey: 'olm~Subscription',
  labelPlural: 'Subscriptions',
  labelPluralKey: 'olm~Subscriptions',
  apiGroup: 'operators.coreos.com',
  apiVersion: 'v1alpha1',
  abbr: 'SUB',
  namespaced: true,
  crd: true,
  plural: 'subscriptions',
  legacyPluralURL: true,
};

export const OperatorGroupModel: K8sModel = {
  kind: 'OperatorGroup',
  label: 'OperatorGroup',
  labelKey: 'olm~OperatorGroup',
  labelPlural: 'OperatorGroups',
  labelPluralKey: 'olm~OperatorGroups',
  apiGroup: 'operators.coreos.com',
  apiVersion: 'v1',
  abbr: 'OG',
  namespaced: true,
  crd: true,
  plural: 'operatorgroups',
};

export const OperatorHubModel: K8sModel = {
  kind: 'OperatorHub',
  label: 'OperatorHub',
  labelKey: 'olm~OperatorHub',
  labelPlural: 'OperatorHubs',
  labelPluralKey: 'olm~OperatorHubs',
  apiGroup: 'config.openshift.io',
  apiVersion: 'v1',
  abbr: 'OH',
  namespaced: false,
  crd: true,
  plural: 'operatorhubs',
};

// OLMv1 Models

export const ClusterExtensionModel: K8sModel = {
  label: 'ClusterExtension',
  labelKey: 'olm-v1~ClusterExtension',
  labelPlural: 'ClusterExtensions',
  labelPluralKey: 'olm-v1~ClusterExtensions',
  apiVersion: 'v1',
  apiGroup: 'olm.operatorframework.io',
  plural: 'clusterextensions',
  abbr: 'CE',
  namespaced: false,
  kind: 'ClusterExtension',
  id: 'clusterextension',
  crd: true,
};

export const ClusterCatalogModel: K8sModel = {
  label: 'ClusterCatalog',
  labelKey: 'olm-v1~ClusterCatalog',
  labelPlural: 'ClusterCatalogs',
  labelPluralKey: 'olm-v1~ClusterCatalogs',
  apiVersion: 'v1',
  apiGroup: 'olm.operatorframework.io',
  plural: 'clustercatalogs',
  abbr: 'CC',
  namespaced: false,
  kind: 'ClusterCatalog',
  id: 'clustercatalog',
  crd: true,
};
