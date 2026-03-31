/**
 * Shims for @console/internal/components/modals barrel export.
 *
 * These lazy overlay components were imported from the modals barrel.
 * They are stubs that will be resolved at runtime via module federation.
 *
 * TODO: replace with SDK modal patterns or inline implementations.
 */

import type { OverlayComponent } from '@openshift-console/dynamic-plugin-sdk/src/app/modal-support/OverlayProvider';

/**
 * Stub LazyDeleteModalOverlay.
 * At runtime the host app provides the real implementation via module federation.
 */
export const LazyDeleteModalOverlay: OverlayComponent<any> = (props) => {
  return null as any;
};
LazyDeleteModalOverlay.displayName = 'LazyDeleteModalOverlay';

export const LazyLabelsModalOverlay: OverlayComponent<any> = (props) => {
  return null as any;
};
LazyLabelsModalOverlay.displayName = 'LazyLabelsModalOverlay';

export const LazyAnnotationsModalOverlay: OverlayComponent<any> = (props) => {
  return null as any;
};
LazyAnnotationsModalOverlay.displayName = 'LazyAnnotationsModalOverlay';

export const LazyTaintsModalOverlay: OverlayComponent<any> = (props) => {
  return null as any;
};
LazyTaintsModalOverlay.displayName = 'LazyTaintsModalOverlay';

export const LazyTolerationsModalOverlay: OverlayComponent<any> = (props) => {
  return null as any;
};
LazyTolerationsModalOverlay.displayName = 'LazyTolerationsModalOverlay';
