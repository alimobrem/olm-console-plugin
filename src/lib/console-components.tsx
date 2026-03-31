/**
 * Shims for @console/internal/components/utils.
 *
 * Each export replaces one or more imports that previously came from
 * @console/internal/components/utils (or its sub-modules).
 */

import type { FC, ReactNode } from 'react';
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  EmptyState,
  EmptyStateBody,
  Spinner,
  Title,
} from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import type { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { ResourceLink, ResourceIcon, Timestamp } from '@openshift-console/dynamic-plugin-sdk';

/* Re-export SDK primitives so consumers can import from one place */
export { ResourceLink, ResourceIcon } from '@openshift-console/dynamic-plugin-sdk';
export { useAccessReview } from './sdk-compat';

/* Re-export path helpers already implemented in k8s-shims */
export { resourceObjPath, resourcePath, asAccessReview } from './k8s';

/* ------------------------------------------------------------------ */
/*  resourcePathFromModel                                              */
/* ------------------------------------------------------------------ */

export const resourcePathFromModel = (
  model: { apiGroup?: string; apiVersion?: string; plural: string },
  name?: string,
  namespace?: string,
): string => {
  const base = model.apiGroup
    ? `/k8s/${namespace ? `ns/${namespace}` : 'cluster'}/${model.plural}`
    : `/k8s/${namespace ? `ns/${namespace}` : 'cluster'}/${model.plural}`;
  return name ? `${base}/${name}` : base;
};

/**
 * Replaces `resourceListPathFromModel` from @console/internal/components/utils
 */
export const resourceListPathFromModel = (
  model: { apiGroup?: string; apiVersion?: string; plural: string },
  namespace?: string,
): string => resourcePathFromModel(model, undefined, namespace);

/* ------------------------------------------------------------------ */
/*  StatusBox                                                          */
/* ------------------------------------------------------------------ */

export type StatusBoxProps = {
  loaded?: boolean;
  loadError?: any;
  data?: any;
  label?: string;
  skeleton?: ReactNode;
  EmptyMsg?: FC;
  NoDataEmptyMsg?: FC;
  children?: ReactNode;
};

export const StatusBox: FC<StatusBoxProps> = ({
  loaded,
  loadError,
  data,
  label,
  skeleton,
  EmptyMsg,
  NoDataEmptyMsg,
  children,
}) => {
  const { t } = useTranslation();

  if (loadError) {
    return (
      <div className="cos-status-box pf-v6-u-text-align-center" data-test="status-box">
        <div className="pf-v6-u-danger-color-100">
          {t('public~Error loading {{label}}: {{error}}', {
            label: label || 'data',
            error: loadError.message || loadError.toString?.() || 'unknown error',
          })}
        </div>
      </div>
    );
  }

  if (!loaded) {
    if (skeleton) {
      return <>{skeleton}</>;
    }
    return (
      <div className="cos-status-box pf-v6-u-text-align-center" data-test="status-box">
        <Spinner size="lg" />
      </div>
    );
  }

  const empty = Array.isArray(data) ? data.length === 0 : !data;
  if (empty) {
    if (EmptyMsg) return <EmptyMsg />;
    if (NoDataEmptyMsg) return <NoDataEmptyMsg />;
  }

  return <>{children}</>;
};
StatusBox.displayName = 'StatusBox';

/* ------------------------------------------------------------------ */
/*  LoadingBox / LoadingInline                                         */
/* ------------------------------------------------------------------ */

export const LoadingBox: FC = () => (
  <div className="cos-status-box pf-v6-u-text-align-center">
    <Spinner size="lg" />
  </div>
);
LoadingBox.displayName = 'LoadingBox';

export const LoadingInline: FC = () => <Spinner size="md" aria-label="Loading" />;
LoadingInline.displayName = 'LoadingInline';

/* ------------------------------------------------------------------ */
/*  SectionHeading                                                     */
/* ------------------------------------------------------------------ */

export const SectionHeading: FC<{
  text: string;
  children?: ReactNode;
  id?: string;
  style?: React.CSSProperties;
  required?: boolean;
}> = ({ text, children, id, style, required }) => (
  <Title headingLevel="h2" size="lg" className="co-section-heading" id={id} style={style}>
    {text}
    {required && <span className="co-required" />}
    {children}
  </Title>
);
SectionHeading.displayName = 'SectionHeading';

/* ------------------------------------------------------------------ */
/*  ConsoleEmptyState                                                  */
/* ------------------------------------------------------------------ */

// Inline ConsoleEmptyState replacement
export const ConsoleEmptyState: FC<{ children?: ReactNode }> = ({ children }) => (
  <EmptyState>
    <EmptyStateBody>{children}</EmptyStateBody>
  </EmptyState>
);

/* ------------------------------------------------------------------ */
/*  ResourceSummary                                                    */
/* ------------------------------------------------------------------ */

export const ResourceSummary: FC<{
  resource: K8sResourceCommon;
  showAnnotations?: boolean;
  showPodSelector?: boolean;
  showNodeSelector?: boolean;
  showTolerations?: boolean;
  children?: ReactNode;
  customPathName?: string;
}> = ({ resource, children }) => {
  const { t } = useTranslation();
  const { metadata } = resource || {};
  return (
    <DescriptionList>
      <DescriptionListGroup>
        <DescriptionListTerm>{t('public~Name')}</DescriptionListTerm>
        <DescriptionListDescription>{metadata?.name ?? '-'}</DescriptionListDescription>
      </DescriptionListGroup>
      {metadata?.namespace && (
        <DescriptionListGroup>
          <DescriptionListTerm>{t('public~Namespace')}</DescriptionListTerm>
          <DescriptionListDescription>
            <ResourceLink kind="Namespace" name={metadata.namespace} />
          </DescriptionListDescription>
        </DescriptionListGroup>
      )}
      <DescriptionListGroup>
        <DescriptionListTerm>{t('public~Created at')}</DescriptionListTerm>
        <DescriptionListDescription>
          <Timestamp timestamp={metadata?.creationTimestamp} />
        </DescriptionListDescription>
      </DescriptionListGroup>
      {children}
    </DescriptionList>
  );
};
ResourceSummary.displayName = 'ResourceSummary';

/* ------------------------------------------------------------------ */
/*  navFactory                                                         */
/* ------------------------------------------------------------------ */

/**
 * Produces standard page-tab descriptors.
 * TODO: rewrite to use SDK HorizontalNav natively.
 */
export const navFactory = {
  details: (component?: any) => ({
    href: '',
    nameKey: 'public~Details',
    name: 'Details',
    component,
  }),
  editYaml: (component?: any) => ({
    href: 'yaml',
    nameKey: 'public~YAML',
    name: 'YAML',
    component,
  }),
  events: (component?: any) => ({
    href: 'events',
    nameKey: 'public~Events',
    name: 'Events',
    component,
  }),
};

/* ------------------------------------------------------------------ */
/*  DetailsItem                                                        */
/* ------------------------------------------------------------------ */

export const DetailsItem: FC<{
  label: string;
  obj?: any;
  path?: string;
  children?: ReactNode;
  editAsGroup?: boolean;
  hideEmpty?: boolean;
  canEdit?: boolean;
  onEdit?: () => void;
  [key: string]: any;
}> = ({ label, children, hideEmpty }) => {
  if (hideEmpty && !children) return null;
  return (
    <DescriptionListGroup>
      <DescriptionListTerm>{label}</DescriptionListTerm>
      <DescriptionListDescription>{children ?? '-'}</DescriptionListDescription>
    </DescriptionListGroup>
  );
};
DetailsItem.displayName = 'DetailsItem';

/* ------------------------------------------------------------------ */
/*  AsyncComponent                                                     */
/* ------------------------------------------------------------------ */

export const AsyncComponent: FC<{ loader: () => Promise<any>; [key: string]: any }> = ({
  loader,
  ...rest
}) => {
  const [Component, setComponent] = useState<FC<any> | null>(null);
  useEffect(() => {
    let cancelled = false;
    loader().then((c: any) => {
      if (!cancelled) {
        setComponent(() => (c && c.default ? c.default : c));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [loader]);

  if (!Component) return <LoadingInline />;
  return <Component {...rest} />;
};
AsyncComponent.displayName = 'AsyncComponent';

/* ------------------------------------------------------------------ */
/*  ScrollToTopOnMount / useScrollToTopOnMount                         */
/* ------------------------------------------------------------------ */

export const ScrollToTopOnMount: FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
};
ScrollToTopOnMount.displayName = 'ScrollToTopOnMount';

export const useScrollToTopOnMount = (): void => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
};

/* ------------------------------------------------------------------ */
/*  RequireCreatePermission                                            */
/* ------------------------------------------------------------------ */

export const RequireCreatePermission: FC<{
  model: any;
  namespace?: string;
  children: ReactNode;
}> = ({ children }) => {
  // TODO: implement actual access review check
  return <>{children}</>;
};
RequireCreatePermission.displayName = 'RequireCreatePermission';

/* ------------------------------------------------------------------ */
/*  FieldLevelHelp                                                     */
/* ------------------------------------------------------------------ */

// Inline FieldLevelHelp using PatternFly Popover
import { Popover } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';

export const FieldLevelHelp: FC<{ children: ReactNode }> = ({ children }) => (
  <Popover bodyContent={children}>
    <button
      type="button"
      className="pf-v6-c-form__group-label-help"
      aria-label="More info"
    >
      <OutlinedQuestionCircleIcon />
    </button>
  </Popover>
);

/* ------------------------------------------------------------------ */
/*  LabelList / Selector                                               */
/* ------------------------------------------------------------------ */

export const LabelList: FC<{ labels?: Record<string, string>; kind?: string; expand?: boolean }> = ({
  labels,
}) => {
  if (!labels || Object.keys(labels).length === 0) return <>-</>;
  return (
    <span>
      {Object.entries(labels).map(([k, v]) => (
        <span key={k} className="co-m-label">
          {k}={v}
        </span>
      ))}
    </span>
  );
};
LabelList.displayName = 'LabelList';

export type LabelListProps = {
  labels?: Record<string, string>;
  kind?: string;
  expand?: boolean;
};

export const Selector: FC<{ selector?: any; namespace?: string; kind?: string }> = ({
  selector,
}) => {
  if (!selector) return <>-</>;
  const matchLabels = selector.matchLabels || {};
  return <LabelList labels={matchLabels} />;
};
Selector.displayName = 'Selector';

/* ------------------------------------------------------------------ */
/*  NumberSpinner                                                      */
/* ------------------------------------------------------------------ */

export const NumberSpinner: FC<{
  value: number;
  onChange: (e: any) => void;
  changeValueBy: (delta: number) => void;
  min?: number;
  max?: number;
}> = ({ value, onChange, changeValueBy, min, max }) => (
  <div className="co-m-number-spinner">
    <button type="button" onClick={() => changeValueBy(-1)} disabled={min !== undefined && value <= min}>
      -
    </button>
    <input type="number" value={value} onChange={onChange} min={min} max={max} />
    <button type="button" onClick={() => changeValueBy(1)} disabled={max !== undefined && value >= max}>
      +
    </button>
  </div>
);
NumberSpinner.displayName = 'NumberSpinner';

/* ------------------------------------------------------------------ */
/*  SelectorInput                                                      */
/* ------------------------------------------------------------------ */

export const SelectorInput: FC<{
  onChange: (tags: string[]) => void;
  tags?: string[];
  labelClassName?: string;
  inputProps?: any;
}> = ({ onChange, tags = [] }) => {
  const [inputValue, setInputValue] = useState('');
  return (
    <div>
      {tags.map((t) => (
        <span key={t} className="co-m-label">
          {t}
          <button type="button" onClick={() => onChange(tags.filter((tag) => tag !== t))}>
            x
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            onChange([...tags, inputValue.trim()]);
            setInputValue('');
          }
        }}
      />
    </div>
  );
};
SelectorInput.displayName = 'SelectorInput';

/* ------------------------------------------------------------------ */
/*  CopyToClipboard                                                    */
/* ------------------------------------------------------------------ */

export const CopyToClipboard: FC<{ value: string }> = ({ value }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [value]);
  return (
    <div className="co-copy-to-clipboard">
      <pre className="co-pre-wrap co-copy-to-clipboard__text">{value}</pre>
      <button type="button" className="btn btn-default" onClick={handleCopy}>
        {copied ? t('public~Copied') : t('public~Copy')}
      </button>
    </div>
  );
};
CopyToClipboard.displayName = 'CopyToClipboard';

/* ------------------------------------------------------------------ */
/*  LinkifyExternal                                                    */
/* ------------------------------------------------------------------ */

export const LinkifyExternal: FC<{ children?: ReactNode }> = ({ children }) => <>{children}</>;
LinkifyExternal.displayName = 'LinkifyExternal';

/* ------------------------------------------------------------------ */
/*  ButtonBar                                                          */
/* ------------------------------------------------------------------ */

export const ButtonBar: FC<{
  className?: string;
  errorMessage?: string;
  inProgress?: boolean;
  children?: ReactNode;
}> = ({ className, errorMessage, inProgress, children }) => (
  <div className={className || 'co-m-btn-bar'}>
    {errorMessage && <div className="pf-v6-u-danger-color-100">{errorMessage}</div>}
    {inProgress && <LoadingInline />}
    {children}
  </div>
);
ButtonBar.displayName = 'ButtonBar';

/* ------------------------------------------------------------------ */
/*  NsDropdown                                                         */
/* ------------------------------------------------------------------ */

/**
 * Minimal NsDropdown shim.
 * TODO: replace with SDK namespace selector or PatternFly dropdown.
 */
export const NsDropdown: FC<{
  selectedKey?: string;
  onChange?: (ns: string) => void;
  id?: string;
  [key: string]: any;
}> = (props) => {
  // Stub – in production the module-federation shared scope provides
  // the real implementation.
  return null as any;
};
NsDropdown.displayName = 'NsDropdown';

/* ------------------------------------------------------------------ */
/*  ListDropdown                                                       */
/* ------------------------------------------------------------------ */

export type ListDropdownProps = {
  id?: string;
  resources?: any[];
  desc?: string;
  placeholder?: string;
  selectedKey?: string;
  selectedKeyKind?: string;
  onChange?: (key: string, kindLabel?: string, resource?: any) => void;
  actionItems?: { actionTitle: string; actionKey: string }[];
  [key: string]: any;
};

/**
 * Minimal ListDropdown shim.
 * TODO: replace with PatternFly Select or SDK equivalent.
 */
export const ListDropdown: FC<ListDropdownProps> = (props) => {
  return null as any;
};
ListDropdown.displayName = 'ListDropdown';

/* ------------------------------------------------------------------ */
/*  ExpandCollapse                                                     */
/* ------------------------------------------------------------------ */

export { ExpandableSection as ExpandCollapse } from '@patternfly/react-core';

/* ------------------------------------------------------------------ */
/*  skeletonCatalog                                                    */
/* ------------------------------------------------------------------ */

export const skeletonCatalog = <div className="skeleton-catalog" />;

/* ------------------------------------------------------------------ */
/*  useRefWidth                                                        */
/* ------------------------------------------------------------------ */

export const useRefWidth = (): [React.RefObject<HTMLDivElement | null>, number] => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const updateWidth = () => {
      if (ref.current) {
        setWidth(ref.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);
  return [ref, width];
};

/* ------------------------------------------------------------------ */
/*  Documentation URL helpers                                          */
/* ------------------------------------------------------------------ */

export const DOC_URL_OPERATORFRAMEWORK_SDK =
  'https://sdk.operatorframework.io/docs/building-operators/';

export const documentationURLs = {
  defined: (url: string) => url,
};

export const getDocumentationURL = (url: string): string => url;

export const isManaged = (): boolean =>
  window.SERVER_FLAGS?.managedCluster === 'true' || false;

export const getURLSearchParams = (): Record<string, string> => {
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
};

/* ------------------------------------------------------------------ */
/*  getBreadcrumbPath                                                  */
/* ------------------------------------------------------------------ */

export const getBreadcrumbPath = (match: any, suffix?: string): string => {
  const url = match?.url || '';
  return suffix ? `${url}/${suffix}` : url;
};

/* ------------------------------------------------------------------ */
/*  ConsoleSelect                                                      */
/* ------------------------------------------------------------------ */

/**
 * Minimal shim for ConsoleSelect.
 * TODO: replace with PatternFly Select.
 */
export const ConsoleSelect: FC<any> = (props) => null as any;
ConsoleSelect.displayName = 'ConsoleSelect';
