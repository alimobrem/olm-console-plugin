/**
 * Utility for parsing JSON annotations from K8s resources.
 * Previously imported from @console/shared/src/utils/annotations.
 */

/**
 * Parse a JSON string from an annotation value, returning a default value on failure.
 */
export const parseJSONAnnotation = <T = unknown>(
  annotations: Record<string, string> | undefined,
  key: string,
  defaultValue?: T,
): T | undefined => {
  const value = annotations?.[key];
  if (!value) return defaultValue;
  try {
    return JSON.parse(value) as T;
  } catch {
    // eslint-disable-next-line no-console
    console.warn(`Failed to parse annotation ${key}:`, value);
    return defaultValue;
  }
};
