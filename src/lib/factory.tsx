/**
 * Bridge between legacy @console/internal/components/factory API
 * and the @openshift-console/dynamic-plugin-sdk.
 *
 * Re-exports SDK components where available. Provides compatibility
 * wrappers for patterns that don't have direct SDK equivalents.
 */

import type { ComponentType, FC, ReactNode } from 'react';
import { useParams } from 'react-router';
import type { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import {
  HorizontalNav,
  VirtualizedTable,
  TableData as SDKTableData,
  ListPageHeader as SDKListPageHeader,
  ListPageBody,
  ListPageCreate as SDKListPageCreate,
  ListPageCreateDropdown as SDKListPageCreateDropdown,
  ListPageFilter as SDKListPageFilter,
  useListPageFilter as sdkUseListPageFilter,
  useActiveColumns,
  useK8sWatchResources,
} from '@openshift-console/dynamic-plugin-sdk';

// Re-export SDK components directly
export {
  HorizontalNav,
  VirtualizedTable,
  ListPageBody,
  useActiveColumns,
};

// Wrapper that makes id/activeColumnIDs optional for legacy call sites
const ALL_COLUMNS = new Set<string>();
export const TableData: FC<{
  id?: string;
  activeColumnIDs?: Set<string>;
  className?: string;
  children?: ReactNode;
}> = ({ id = '', activeColumnIDs = ALL_COLUMNS, ...rest }) => (
  <SDKTableData id={id} activeColumnIDs={activeColumnIDs} {...rest} />
);
export const ListPageHeader = SDKListPageHeader;
export const ListPageFilter = SDKListPageFilter;
export const ListPageCreateDropdown = SDKListPageCreateDropdown;
export const ListPageCreateLink = SDKListPageCreate;
export const useListPageFilter = sdkUseListPageFilter;

/* ------------------------------------------------------------------ */
/*  Type aliases                                                       */
/* ------------------------------------------------------------------ */

export type RowFunctionArgs<R = K8sResourceCommon> = {
  obj: R;
  index: number;
  key: string;
  style: React.CSSProperties;
};

export type Flatten<R = any> = (resources: any) => R[];

export type Filter = {
  type: string;
  selected: string[];
  reducer?: (obj: any) => string;
  items?: { id: string; title: string }[];
  filter?: (items: string[], obj: any) => boolean;
};

export type Page<T = any> = {
  href: string;
  name?: string;
  component?: ComponentType<any>;
  nameKey?: string;
  badge?: ReactNode;
  pageData?: any;
};

export type DetailsPageProps = {
  kind?: string;
  kindObj?: any;
  match?: any;
  name?: string;
  namespace?: string;
  pages?: Page[];
  menuActions?: any[];
  breadcrumbsFor?: (obj: any) => any[];
  resources?: any[];
  customData?: any;
  [key: string]: any;
};

export type TableProps = {
  data?: any[];
  Header?: any;
  Row?: any;
  'aria-label'?: string;
  loaded?: boolean;
  loadError?: any;
  Rows?: any;
  virtualize?: boolean;
  [key: string]: any;
};

export type MultiListPageProps = {
  resources?: any[];
  rowFilters?: any[];
  flatten?: Flatten;
  ListComponent?: ComponentType<any>;
  [key: string]: any;
};

/* ------------------------------------------------------------------ */
/*  DetailsPage — wraps HorizontalNav with K8s resource loading        */
/* ------------------------------------------------------------------ */

/**
 * Compatibility wrapper for the legacy DetailsPage pattern.
 * Loads a single K8s resource by name/namespace and renders HorizontalNav
 * with the specified pages/tabs.
 */
export const DetailsPage: FC<DetailsPageProps> = ({
  kind,
  pages = [],
  menuActions,
  breadcrumbsFor,
  resources,
  customData,
  ...rest
}) => {
  const params = useParams<{ name: string; ns?: string }>();
  const name = rest.name || params.name;
  const namespace = rest.namespace || params.ns;

  // Convert legacy pages format to HorizontalNav pages
  const navPages = pages.map((page) => ({
    href: page.href,
    name: page.nameKey || page.name,
    component: page.component,
  }));

  return (
    <HorizontalNav
      pages={navPages}
      resource={{ kind, metadata: { name, namespace } } as K8sResourceCommon}
    />
  );
};
DetailsPage.displayName = 'DetailsPage';

/* ------------------------------------------------------------------ */
/*  Table — wraps VirtualizedTable with legacy row/header adapter       */
/* ------------------------------------------------------------------ */

/**
 * Compatibility wrapper for the legacy Table component.
 * Wraps VirtualizedTable with adapter for old-style Header/Row patterns.
 */
export const Table: FC<TableProps> = ({
  data = [],
  Header,
  Row,
  loaded = true,
  loadError,
  'aria-label': ariaLabel,
  ...rest
}) => {
  // Convert legacy Header function to columns array
  const columns = Header ? Header(rest) : [];

  // Wrap legacy Row render function into SDK RowProps pattern
  const SDKRow = Row
    ? ({ obj, activeColumnIDs }: { obj: any; activeColumnIDs: Set<string> }) => {
        return Row({ obj, index: 0, key: obj?.metadata?.uid || '', style: {} });
      }
    : () => null;

  return (
    <VirtualizedTable
      data={data}
      unfilteredData={data}
      loaded={loaded}
      loadError={loadError}
      columns={columns}
      Row={SDKRow}
      aria-label={ariaLabel}
    />
  );
};
Table.displayName = 'Table';

/* ------------------------------------------------------------------ */
/*  MultiListPage — watches multiple resources and renders a list      */
/* ------------------------------------------------------------------ */

/**
 * Compatibility wrapper for MultiListPage.
 * Watches multiple K8s resources, flattens them, and renders a list component.
 */
export const MultiListPage: FC<MultiListPageProps> = ({
  resources = [],
  rowFilters,
  flatten,
  ListComponent,
  ...rest
}) => {
  const watchedResources = resources.reduce((acc, resource) => {
    const key = resource.prop || resource.kind;
    acc[key] = {
      groupVersionKind: resource.groupVersionKind || {
        group: resource.group || '',
        version: resource.version || 'v1',
        kind: resource.kind,
      },
      isList: true,
      namespaced: resource.namespaced ?? true,
      namespace: resource.namespace,
    };
    return acc;
  }, {} as Record<string, any>);

  const results = useK8sWatchResources<Record<string, K8sResourceCommon[]>>(watchedResources);

  const allLoaded = Object.values(results).every((r: any) => r.loaded);
  const loadError = Object.values(results).find((r: any) => r.loadError)?.loadError;
  const data = flatten
    ? flatten(
        Object.entries(results).reduce((acc, [key, val]: [string, any]) => {
          acc[key] = { data: val.data, loaded: val.loaded, loadError: val.loadError };
          return acc;
        }, {} as Record<string, any>),
      )
    : Object.values(results).flatMap((r: any) => r.data || []);

  if (ListComponent) {
    return <ListComponent data={data} loaded={allLoaded} loadError={loadError} {...rest} />;
  }

  return null;
};
MultiListPage.displayName = 'MultiListPage';

/* ------------------------------------------------------------------ */
/*  navFactory — helper for common detail page tabs                    */
/* ------------------------------------------------------------------ */

export const navFactory = {
  details: (component: ComponentType<any>) => ({
    href: '',
    name: 'Details',
    component,
  }),
  editYaml: (component?: ComponentType<any>) => ({
    href: 'yaml',
    name: 'YAML',
    component: component || (() => null),
  }),
  events: (component?: ComponentType<any>) => ({
    href: 'events',
    name: 'Events',
    component: component || (() => null),
  }),
};
