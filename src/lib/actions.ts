/**
 * Shims for @console/internal/actions/ui.
 *
 * These action creators produce Redux actions consumed by the console
 * UI reducer.  They are used with `useConsoleDispatch`.
 */

import type { DeprecatedOperatorWarning } from '../olm/types';

/* ------------------------------------------------------------------ */
/*  Action type constants                                              */
/* ------------------------------------------------------------------ */

// These must match the ActionType enum values in
// frontend/public/actions/ui.ts so that the shared Redux reducer
// recognises them.
const ActionType = {
  SetShowOperandsInAllNamespaces: 'setShowOperandsInAllNamespaces' as const,
  SetDeprecatedPackage: 'setDeprecatedPackage' as const,
  SetDeprecatedChannel: 'setDeprecatedChannel' as const,
  SetDeprecatedVersion: 'setDeprecatedVersion' as const,
};

/* ------------------------------------------------------------------ */
/*  Generic action helper                                              */
/* ------------------------------------------------------------------ */

const action = <T extends string, P>(type: T, payload: P) => ({ type, payload });

/* ------------------------------------------------------------------ */
/*  Exported action creators                                           */
/* ------------------------------------------------------------------ */

export const setShowOperandsInAllNamespaces = (value: boolean) =>
  action(ActionType.SetShowOperandsInAllNamespaces, { value });

export const setDeprecatedPackage = (value: DeprecatedOperatorWarning) =>
  action(ActionType.SetDeprecatedPackage, { value });

export const setDeprecatedChannel = (value: DeprecatedOperatorWarning) =>
  action(ActionType.SetDeprecatedChannel, { value });

export const setDeprecatedVersion = (value: DeprecatedOperatorWarning) =>
  action(ActionType.SetDeprecatedVersion, { value });

/* ------------------------------------------------------------------ */
/*  getActiveNamespace                                                 */
/* ------------------------------------------------------------------ */

/**
 * Returns the currently-active namespace from the global Redux store.
 *
 * In the console host the store is available on `window.__REDUX_STORE__`.
 * The SDK also exposes `useActiveNamespace` as a hook alternative.
 */
export const getActiveNamespace = (): string => {
  try {
    // The console host attaches the store to the window object.
    const store = (window as any).__REDUX_STORE__;
    if (store) {
      return store.getState().UI.get('activeNamespace') || '';
    }
  } catch {
    // ignore
  }
  return '';
};
