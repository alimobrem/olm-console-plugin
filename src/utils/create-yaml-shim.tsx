/**
 * Shim for @console/internal/components/create-yaml.
 *
 * The real CreateYAML wraps the Monaco-based YAML editor.
 * This stub component exists so that files compile without
 * reaching into @console/internal.
 *
 * TODO: replace with SDK ResourceYAMLEditor or equivalent.
 */

import type { FC } from 'react';

export type CreateYAMLProps = {
  hideHeader?: boolean;
  onChange?: (yaml: string) => void;
  template?: string;
  resourceObjPath?: (...args: any[]) => string;
  [key: string]: any;
};

/**
 * Placeholder CreateYAML.
 * At runtime the module-federation shared scope provides the real
 * implementation; this stub allows standalone builds to succeed.
 */
export const CreateYAML: FC<CreateYAMLProps> = (props) => {
  return null as any;
};
CreateYAML.displayName = 'CreateYAML';
