/**
 * Simple utility functions previously imported from @console/shared/src/utils/utils.
 */
import type { JSONSchema7 } from 'json-schema';
import type { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';

/**
 * Alphanumeric comparison for sorting strings.
 */
export const alphanumericCompare = (a: string, b: string): number => {
  return (a || '').localeCompare(b || '', undefined, { numeric: true, sensitivity: 'base' });
};

/**
 * Parse a comma-separated list string into an array.
 */
export const parseList = (list: string): string[] => {
  return list
    ? list
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
};

/**
 * Concatenate strings with a separator (default comma).
 */
export const strConcat = (items: string[], separator = ','): string => {
  return items.filter(Boolean).join(separator);
};

/**
 * Check if a mouse/keyboard event has a modifier key pressed.
 */
export const isModifiedEvent = (event: React.MouseEvent | MouseEvent): boolean => {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
};

/**
 * Walk a JSON schema to find the sub-schema at a given dot-separated path.
 */
export const getSchemaAtPath = (schema: JSONSchema7, path: string): JSONSchema7 | undefined => {
  if (!path || !schema) return schema;
  const parts = path.split('.');
  let current: JSONSchema7 | undefined = schema;
  for (const part of parts) {
    if (!current) return undefined;
    if (current.properties?.[part]) {
      current = current.properties[part] as JSONSchema7;
    } else if (current.items && typeof current.items === 'object' && !Array.isArray(current.items)) {
      const items = current.items as JSONSchema7;
      if (items.properties?.[part]) {
        current = items.properties[part] as JSONSchema7;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }
  return current;
};

/**
 * Get the name of a K8s resource.
 */
export const getName = (obj: K8sResourceCommon): string | undefined => obj?.metadata?.name;

/**
 * Get the namespace of a K8s resource.
 */
export const getNamespace = (obj: K8sResourceCommon): string | undefined =>
  obj?.metadata?.namespace;
