import type { WatchK8sResult } from '@openshift-console/dynamic-plugin-sdk';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { getGroupVersionKindForModel } from '../../lib/sdk-compat';
import { CloudCredentialModel } from '../../lib/models';
import type { CloudCredentialKind } from '../../lib/k8s';

export const useClusterCloudCredentialConfig = (): WatchK8sResult<CloudCredentialKind> =>
  useK8sWatchResource<CloudCredentialKind>({
    groupVersionKind: getGroupVersionKindForModel(CloudCredentialModel),
    name: 'cluster',
  });
