import {
  useK8sWatchResource,
  getGroupVersionKindForModel,
} from '@openshift-console/dynamic-plugin-sdk';
import type { WatchK8sResult } from '../../lib/k8s';
import { fromRequirements } from '../../lib/k8s';
import { PackageManifestModel } from '../models';
import type { PackageManifestKind } from '../types';

export const usePackageManifests = (namespace: string): WatchK8sResult<PackageManifestKind[]> =>
  useK8sWatchResource<PackageManifestKind[]>({
    isList: true,
    groupVersionKind: getGroupVersionKindForModel(PackageManifestModel),
    namespace,
    selector: fromRequirements([
      { key: 'opsrc-owner-name', operator: 'DoesNotExist' },
      { key: 'csc-owner-name', operator: 'DoesNotExist' },
    ]),
  });
