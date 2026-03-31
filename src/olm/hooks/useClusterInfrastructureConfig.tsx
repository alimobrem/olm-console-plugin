import type { WatchK8sResult } from '@openshift-console/dynamic-plugin-sdk';
import {
  getGroupVersionKindForModel,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { InfrastructureModel } from '../../lib/models';
import type { InfrastructureKind } from '../../lib/k8s';

export const useClusterInfrastructureConfig = (): WatchK8sResult<InfrastructureKind> =>
  useK8sWatchResource<InfrastructureKind>({
    groupVersionKind: getGroupVersionKindForModel(InfrastructureModel),
    name: 'cluster',
  });
