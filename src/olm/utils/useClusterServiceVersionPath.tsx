import { getReferenceForModel } from '@openshift-console/dynamic-plugin-sdk';
import { resourceObjPath, resourcePath } from '../../lib/console-components';
import { ALL_NAMESPACES_KEY } from '../../lib/constants';
import { useActiveNamespace } from '@openshift-console/dynamic-plugin-sdk';
import { ClusterServiceVersionModel } from '../models';
import type { ClusterServiceVersionKind } from '../types';

export const useClusterServiceVersionPath = (csv: ClusterServiceVersionKind): string => {
  const [activeNamespace] = useActiveNamespace();
  const csvReference = getReferenceForModel(ClusterServiceVersionModel);
  // Don't link to csv in 'openshift' namespace when copiedCSVsDisabled and in another namespace
  if (
    window.SERVER_FLAGS.copiedCSVsDisabled &&
    csv.metadata.namespace === 'openshift' && // Is global csv
    activeNamespace !== ALL_NAMESPACES_KEY
  ) {
    return resourcePath(csvReference, csv.metadata.name, activeNamespace);
  }
  return resourceObjPath(csv, csvReference);
};
