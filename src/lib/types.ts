/**
 * Types previously imported from @console/shared/src/types.
 */

/**
 * Route params type for React Router.
 */
export type RouteParams<T extends string = string> = {
  [key in T]?: string;
};

/**
 * Modal component props passed to overlay modals.
 */
export type ModalComponentProps = {
  cancel?: () => void;
  close?: () => void;
};
