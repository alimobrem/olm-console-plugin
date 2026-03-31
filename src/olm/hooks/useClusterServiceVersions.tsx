import {
  useK8sWatchResource,
  getGroupVersionKindForModel,
} from '@openshift-console/dynamic-plugin-sdk/src/lib-core';
import type { WatchK8sResult } from '../../utils/k8s-shims';
import { ClusterServiceVersionModel } from '../models';
import type { ClusterServiceVersionKind } from '../types';

export const useClusterServiceVersions = (namespace): WatchK8sResult<ClusterServiceVersionKind[]> =>
  useK8sWatchResource<ClusterServiceVersionKind[]>({
    groupVersionKind: getGroupVersionKindForModel(ClusterServiceVersionModel),
    namespaced: true,
    isList: true,
    namespace,
  });
