import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { referenceForModel } from '../../utils/k8s-shims';
import type { OperatorHubKind } from '../components/operator-hub';
import { OperatorHubModel } from '../models';

const useOperatorHubConfig = () =>
  useK8sWatchResource<OperatorHubKind>({
    kind: referenceForModel(OperatorHubModel),
    name: 'cluster',
    isList: false,
  });

export default useOperatorHubConfig;
