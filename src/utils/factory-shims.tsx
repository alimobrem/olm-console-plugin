/**
 * Stub shims for @console/internal/components/factory.
 *
 * These re-export placeholder types and components so that consuming files
 * compile without reaching into @console/internal.  Every export here is
 * intentionally thin — the real migration to SDK VirtualizedTable /
 * HorizontalNav is tracked separately.
 *
 * TODO: rewrite to use SDK VirtualizedTable/HorizontalNav
 */

import type { ComponentType, FC, ReactNode } from 'react';
import type { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';

/* ------------------------------------------------------------------ */
/*  Type aliases                                                       */
/* ------------------------------------------------------------------ */

/** Row render function – mirrors the shape used by the old `Table`. */
export type RowFunctionArgs<R = K8sResourceCommon> = {
  obj: R;
  index: number;
  key: string;
  style: React.CSSProperties;
};

/** Flatten function used by MultiListPage. */
export type Flatten<R = any> = (resources: any) => R[];

/** Filter function used by MultiListPage / Table. */
export type Filter = {
  type: string;
  selected: string[];
  reducer?: (obj: any) => string;
  items?: { id: string; title: string }[];
  filter?: (items: string[], obj: any) => boolean;
};

/** Props accepted by the legacy DetailsPage. */
export type DetailsPageProps = {
  kind?: string;
  kindObj?: any;
  match?: any;
  name?: string;
  namespace?: string;
  pages?: any[];
  menuActions?: any[];
  breadcrumbsFor?: (obj: any) => any[];
  resources?: any[];
  customData?: any;
  [key: string]: any;
};

/** Props accepted by the legacy Table. */
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

/** Props accepted by the legacy MultiListPage. */
export type MultiListPageProps = {
  resources?: any[];
  rowFilters?: any[];
  flatten?: Flatten;
  ListComponent?: ComponentType<any>;
  [key: string]: any;
};

/** Type for Page tabs used in DetailsPage / HorizontalNav. */
export type Page = {
  href: string;
  name: string;
  component?: ComponentType<any>;
  nameKey?: string;
  badge?: ReactNode;
  pageData?: any;
};

/* ------------------------------------------------------------------ */
/*  Stub components                                                    */
/* ------------------------------------------------------------------ */

/**
 * Placeholder DetailsPage.
 * TODO: rewrite to use SDK HorizontalNav + individual detail tabs.
 */
export const DetailsPage: FC<DetailsPageProps> = (props) => {
  // In production the real DetailsPage from @console/internal is still used
  // via the module-federation shared scope.  This stub exists only so that
  // TypeScript resolves the import when building the plugin standalone.
  return null as any;
};
DetailsPage.displayName = 'DetailsPage';

/**
 * Placeholder Table.
 * TODO: rewrite to use SDK VirtualizedTable.
 */
export const Table: FC<TableProps> = (props) => {
  return null as any;
};
Table.displayName = 'Table';

/**
 * Placeholder TableData – renders a <td>.
 * TODO: rewrite to use SDK TableData equivalent.
 */
export const TableData: FC<{
  className?: string;
  id?: string;
  activeColumnIDs?: Set<string>;
  children?: ReactNode;
  [key: string]: any;
}> = ({ className, children, ...rest }) => {
  return <td className={className}>{children}</td>;
};
TableData.displayName = 'TableData';

/**
 * Placeholder MultiListPage.
 * TODO: rewrite to use SDK ListPage.
 */
export const MultiListPage: FC<MultiListPageProps> = (props) => {
  return null as any;
};
MultiListPage.displayName = 'MultiListPage';

/* ------------------------------------------------------------------ */
/*  ListPage sub-components (used by operand/index.tsx)                 */
/* ------------------------------------------------------------------ */

/**
 * Stub useListPageFilter hook.
 * TODO: rewrite to use SDK useListPageFilter.
 */
export const useListPageFilter: any = (..._args: any[]) => [[], [], () => {}];

/**
 * Stub ListPageCreateDropdown.
 * TODO: rewrite to use SDK ListPageCreate.
 */
export const ListPageCreateDropdown: FC<any> = () => null;
ListPageCreateDropdown.displayName = 'ListPageCreateDropdown';

/**
 * Stub ListPageCreateLink.
 * TODO: rewrite to use SDK ListPageCreate.
 */
export const ListPageCreateLink: FC<any> = () => null;
ListPageCreateLink.displayName = 'ListPageCreateLink';

/**
 * Stub ListPageFilter.
 * TODO: rewrite to use SDK ListPageFilter.
 */
const ListPageFilter: FC<any> = () => null;
ListPageFilter.displayName = 'ListPageFilter';
export default ListPageFilter;

/**
 * Stub ListPageHeader.
 * TODO: rewrite to use SDK ListPageHeader.
 */
export const ListPageHeader: FC<any> = ({ children }) => (
  <div className="co-m-pane__heading">{children}</div>
);
ListPageHeader.displayName = 'ListPageHeader';
