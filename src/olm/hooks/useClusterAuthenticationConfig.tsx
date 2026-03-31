import type { WatchK8sResult } from '@openshift-console/dynamic-plugin-sdk/src/lib-core';
import {
  useK8sWatchResource,
  getGroupVersionKindForModel,
} from '@openshift-console/dynamic-plugin-sdk/src/lib-core';
import { AuthenticationModel } from '../../utils/internal-models';
import type { AuthenticationKind } from '../../utils/k8s-shims';

export const useClusterAuthenticationConfig = (): WatchK8sResult<AuthenticationKind> =>
  useK8sWatchResource<AuthenticationKind>({
    groupVersionKind: getGroupVersionKindForModel(AuthenticationModel),
    name: 'cluster',
  });
