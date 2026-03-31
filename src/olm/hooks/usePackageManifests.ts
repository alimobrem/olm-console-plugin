import {
  useK8sWatchResource,
  getGroupVersionKindForModel,
} from '@openshift-console/dynamic-plugin-sdk/src/lib-core';
import type { WatchK8sResult } from '../../utils/k8s-shims';
import { fromRequirements } from '../../utils/k8s-shims';
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
