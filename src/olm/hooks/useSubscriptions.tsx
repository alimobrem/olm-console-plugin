import {
  useK8sWatchResource,
  getGroupVersionKindForModel,
} from '@openshift-console/dynamic-plugin-sdk/src/lib-core';
import type { WatchK8sResult } from '../../utils/k8s-shims';
import { SubscriptionModel } from '../models';
import type { SubscriptionKind } from '../types';

export const useSubscriptions = (): WatchK8sResult<SubscriptionKind[]> =>
  useK8sWatchResource<SubscriptionKind[]>({
    isList: true,
    groupVersionKind: getGroupVersionKindForModel(SubscriptionModel),
  });
