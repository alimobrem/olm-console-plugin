import type { WatchK8sResult } from '@openshift-console/dynamic-plugin-sdk/src/extensions/console-types';
import {
  getGroupVersionKindForModel,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk/src/lib-core';
import { InfrastructureModel } from '../../utils/internal-models';
import type { InfrastructureKind } from '../../utils/k8s-shims';

export const useClusterInfrastructureConfig = (): WatchK8sResult<InfrastructureKind> =>
  useK8sWatchResource<InfrastructureKind>({
    groupVersionKind: getGroupVersionKindForModel(InfrastructureModel),
    name: 'cluster',
  });
