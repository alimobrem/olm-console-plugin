/**
 * Shims for catalog utility functions.
 * Migrated from @console/shared (isCatalogTypeEnabled, useIsSoftwareCatalogEnabled).
 *
 * These stubs return `true` to preserve existing behavior.
 * The real implementations check server flags and user preferences to determine
 * whether specific catalog types are enabled.
 *
 * TODO: Implement real catalog type checking based on console configuration
 * once the console plugin SDK exposes the necessary APIs.
 */

/**
 * Check if a specific catalog type is enabled.
 * Stub: always returns true.
 *
 * @param _catalogTypeId - The catalog type identifier to check
 * @returns true (stub)
 */
export const isCatalogTypeEnabled = (_catalogTypeId: string): boolean => {
  // TODO: Read from console operator config or server flags
  return true;
};

/**
 * React hook that checks if the Software Catalog is enabled.
 * Stub: always returns true.
 *
 * @returns true (stub)
 */
export const useIsSoftwareCatalogEnabled = (): boolean => {
  // TODO: Read from console operator config or server flags
  return true;
};
