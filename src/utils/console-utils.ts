/**
 * Re-exports of @console/internal/components/utils equivalents.
 * These are available from the SDK, our shims, or can be trivially replaced.
 */

// ResourceLink and ResourceIcon are available in the SDK
export { ResourceLink, ResourceIcon } from '@openshift-console/dynamic-plugin-sdk';

// useAccessReview is available in the SDK
export { useAccessReview } from '@openshift-console/dynamic-plugin-sdk';

// Re-export path utilities from our shims
export { resourceObjPath, resourcePath } from './k8s-shims';

// Re-export everything from utils-shims
export {
  StatusBox,
  LoadingBox,
  LoadingInline,
  SectionHeading,
  ResourceSummary,
  navFactory,
  DetailsItem,
  AsyncComponent,
  ScrollToTopOnMount,
  useScrollToTopOnMount,
  RequireCreatePermission,
  LabelList,
  Selector,
  NumberSpinner,
  SelectorInput,
  CopyToClipboard,
  LinkifyExternal,
  ButtonBar,
  NsDropdown,
  ListDropdown,
  ExpandCollapse,
  skeletonCatalog,
  useRefWidth,
  DOC_URL_OPERATORFRAMEWORK_SDK,
  documentationURLs,
  getDocumentationURL,
  isManaged,
  getURLSearchParams,
  getBreadcrumbPath,
  ConsoleSelect,
  resourcePathFromModel,
  resourceListPathFromModel,
} from './utils-shims';

export type { LabelListProps, ListDropdownProps } from './utils-shims';
export type { StatusBoxProps } from './utils-shims';
