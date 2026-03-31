import type { WatchK8sResult } from '@openshift-console/dynamic-plugin-sdk/src/lib-core';
import {
  useK8sWatchResource,
  getGroupVersionKindForModel,
} from '@openshift-console/dynamic-plugin-sdk/src/lib-core';
import { CloudCredentialModel } from '../../utils/internal-models';
import type { CloudCredentialKind } from '../../utils/k8s-shims';

export const useClusterCloudCredentialConfig = (): WatchK8sResult<CloudCredentialKind> =>
  useK8sWatchResource<CloudCredentialKind>({
    groupVersionKind: getGroupVersionKindForModel(CloudCredentialModel),
    name: 'cluster',
  });
