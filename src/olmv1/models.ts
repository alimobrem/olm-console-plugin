import type { K8sModel } from '@openshift-console/dynamic-plugin-sdk/src/api/common-types';

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
