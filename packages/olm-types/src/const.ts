// OLMv0 constants

export enum Flags {
  OPERATOR_LIFECYCLE_MANAGER = 'OPERATOR_LIFECYCLE_MANAGER',
}

export enum DefaultCatalogSource {
  RedHatOperators = 'redhat-operators',
  RedHatMarketPlace = 'redhat-marketplace',
  CertifiedOperators = 'certified-operators',
  CommunityOperators = 'community-operators',
}

export enum DefaultClusterCatalog {
  OpenShiftRedHatOperators = 'openshift-redhat-operators',
  OpenShiftRedHatMarketPlace = 'openshift-redhat-marketplace',
  OpenShiftCertifiedOperators = 'openshift-certified-operators',
  OpenShiftCommunityOperators = 'openshift-community-operators',
}

export enum OperatorSource {
  RedHatOperators = 'Red Hat',
  RedHatMarketplace = 'Marketplace',
  CertifiedOperators = 'Certified',
  CommunityOperators = 'Community',
  Custom = 'Custom',
}

export const DEFAULT_GLOBAL_OPERATOR_INSTALLATION_NAMESPACE = 'openshift-operators';
export const DEFAULT_SOURCE_NAMESPACE = 'openshift-marketplace';
export const GLOBAL_COPIED_CSV_NAMESPACE = 'openshift';
export const NON_STANDALONE_ANNOTATION_VALUE = 'non-standalone';
export const OPERATOR_NAMESPACE_ANNOTATION = 'olm.operatorNamespace';

// OLMv1 constants

export const CLUSTER_CATALOG_GROUP = 'olm.operatorframework.io';
export const CLUSTER_CATALOG_VERSION = 'v1';
export const CLUSTER_CATALOG_KIND = 'ClusterCatalog';
export const CLUSTER_CATALOG_GROUP_VERSION_KIND = {
  group: CLUSTER_CATALOG_GROUP,
  version: CLUSTER_CATALOG_VERSION,
  kind: CLUSTER_CATALOG_KIND,
};

export const OLMV1_ENABLED_USER_PREFERENCE_KEY = 'console.olmv1.enabled';
export const FLAG_OLMV1_ENABLED = 'OLMV1_ENABLED';
export const CATALOG_LABEL_KEY = 'olm.operatorframework.io/metadata.name';
