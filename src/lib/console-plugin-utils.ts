/**
 * Console plugin utilities.
 * Migrated from @console/shared/src/utils/console-plugin.
 */
import * as _ from 'lodash';
import type { K8sResourceKind } from './k8s';

type Patch = {
  path: string;
  value: any;
  op: string;
};

export const getPluginPatch = (
  console: K8sResourceKind,
  plugin: string,
  enabled: boolean,
): Patch => {
  if (!enabled) {
    return {
      path: '/spec/plugins',
      value: console.spec.plugins.filter((p: string) => p !== plugin),
      op: 'replace',
    };
  }

  return _.isEmpty(console.spec.plugins)
    ? {
        path: '/spec/plugins',
        value: [plugin],
        op: 'add',
      }
    : {
        path: '/spec/plugins/-',
        value: plugin,
        op: 'add',
      };
};

export const getPatchForRemovingPlugins = (console: K8sResourceKind, plugins: string[]): Patch => {
  return {
    path: '/spec/plugins',
    value: console.spec?.plugins?.filter((p: string) => !plugins.includes(p)),
    op: 'replace',
  };
};

export const isPluginEnabled = (console: K8sResourceKind, plugin: string): boolean =>
  !!console?.spec?.plugins?.includes(plugin);
