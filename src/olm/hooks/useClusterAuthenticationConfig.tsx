import type { WatchK8sResult } from '@openshift-console/dynamic-plugin-sdk';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { getGroupVersionKindForModel } from '../../lib/sdk-compat';
import { AuthenticationModel } from '../../lib/models';
import type { AuthenticationKind } from '../../lib/k8s';

export const useClusterAuthenticationConfig = (): WatchK8sResult<AuthenticationKind> =>
  useK8sWatchResource<AuthenticationKind>({
    groupVersionKind: getGroupVersionKindForModel(AuthenticationModel),
    name: 'cluster',
  });
