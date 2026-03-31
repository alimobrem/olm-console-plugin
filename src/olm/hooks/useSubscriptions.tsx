import {
  useK8sWatchResource,
  getGroupVersionKindForModel,
} from '@openshift-console/dynamic-plugin-sdk';
import type { WatchK8sResult } from '../../lib/k8s';
import { SubscriptionModel } from '../models';
import type { SubscriptionKind } from '../types';

export const useSubscriptions = (): WatchK8sResult<SubscriptionKind[]> =>
  useK8sWatchResource<SubscriptionKind[]>({
    isList: true,
    groupVersionKind: getGroupVersionKindForModel(SubscriptionModel),
  });
