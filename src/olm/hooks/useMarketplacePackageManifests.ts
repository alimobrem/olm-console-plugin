import type { WatchK8sResult } from '@openshift-console/dynamic-plugin-sdk';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { getGroupVersionKindForModel } from '../../lib/sdk-compat';
import { PackageManifestModel } from '../models';
import type { PackageManifestKind } from '../types';

export const useMarketplacePackageManifests = (
  namespace: string,
): WatchK8sResult<PackageManifestKind[]> =>
  useK8sWatchResource<PackageManifestKind[]>({
    isList: true,
    namespace,
    groupVersionKind: getGroupVersionKindForModel(PackageManifestModel),
    selector: { matchLabels: { 'openshift-marketplace': 'true' } },
  });
