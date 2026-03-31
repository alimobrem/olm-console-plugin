import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { getGroupVersionKindForModel } from '../../lib/sdk-compat';
import type { WatchK8sResult } from '../../lib/k8s';
import { ClusterServiceVersionModel } from '../models';
import type { ClusterServiceVersionKind } from '../types';

export const useClusterServiceVersions = (namespace): WatchK8sResult<ClusterServiceVersionKind[]> =>
  useK8sWatchResource<ClusterServiceVersionKind[]>({
    groupVersionKind: getGroupVersionKindForModel(ClusterServiceVersionModel),
    namespaced: true,
    isList: true,
    namespace,
  });
