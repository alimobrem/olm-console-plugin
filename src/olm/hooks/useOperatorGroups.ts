import type { WatchK8sResult } from '@openshift-console/dynamic-plugin-sdk';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { getGroupVersionKindForModel } from '../../lib/sdk-compat';
import { OperatorGroupModel } from '../models';
import type { OperatorGroupKind } from '../types';

export const useOperatorGroups = (): WatchK8sResult<OperatorGroupKind[]> =>
  useK8sWatchResource<OperatorGroupKind[]>({
    isList: true,
    groupVersionKind: getGroupVersionKindForModel(OperatorGroupModel),
  });
