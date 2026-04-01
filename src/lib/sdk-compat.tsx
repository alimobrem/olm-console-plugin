/**
 * sdk-compat.tsx
 *
 * Inline implementations of symbols that are exported by
 * @openshift-console/dynamic-plugin-sdk type declarations but are NOT
 * available in the SDK's runtime shared scope.
 *
 * Every consumer that previously imported one of these symbols from
 * '@openshift-console/dynamic-plugin-sdk' should import from this file
 * instead.
 */

import type { FC, ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as React from 'react';
import {
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  Popover,
} from '@patternfly/react-core';
import type { MenuToggleElement } from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  InProgressIcon,
  QuestionCircleIcon,
  BanIcon,
  SyncAltIcon,
  ArrowCircleUpIcon,
} from '@patternfly/react-icons';
import { EllipsisVIcon } from '@patternfly/react-icons';
import type { K8sModel, K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { consoleFetchJSON } from '@openshift-console/dynamic-plugin-sdk';

/* ================================================================== */
/*  Constants                                                          */
/* ================================================================== */

export const K8S_VERB_DELETE = 'delete';
export const K8S_VERB_UPDATE = 'update';
export const KEBAB_COLUMN_CLASS = 'pf-v6-c-table__action';

/* ================================================================== */
/*  Enums                                                              */
/* ================================================================== */

export enum ActionMenuVariant {
  KEBAB = 'KEBAB',
  DROPDOWN = 'DROPDOWN',
}

export enum HealthState {
  OK = 'OK',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  PROGRESS = 'PROGRESS',
  UPDATING = 'UPDATING',
  UPGRADABLE = 'UPGRADABLE',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
  UNKNOWN = 'UNKNOWN',
  LOADING = 'LOADING',
}

/* ================================================================== */
/*  healthStateMapping                                                 */
/* ================================================================== */

export const healthStateMapping: Record<
  string,
  { title: string; priority: number; health: string }
> = {
  [HealthState.OK]: { title: 'Healthy', priority: 0, health: HealthState.OK },
  [HealthState.UNKNOWN]: { title: 'Unknown', priority: 1, health: HealthState.UNKNOWN },
  [HealthState.PROGRESS]: { title: 'Pending', priority: 2, health: HealthState.PROGRESS },
  [HealthState.UPDATING]: { title: 'Updating', priority: 3, health: HealthState.UPDATING },
  [HealthState.UPGRADABLE]: {
    title: 'Upgrade available',
    priority: 4,
    health: HealthState.UPGRADABLE,
  },
  [HealthState.WARNING]: { title: 'Degraded', priority: 5, health: HealthState.WARNING },
  [HealthState.ERROR]: { title: 'Degraded', priority: 6, health: HealthState.ERROR },
  [HealthState.NOT_AVAILABLE]: {
    title: 'Not available',
    priority: 7,
    health: HealthState.NOT_AVAILABLE,
  },
  [HealthState.LOADING]: { title: 'Loading', priority: 8, health: HealthState.LOADING },
};

/* ================================================================== */
/*  Icons                                                              */
/* ================================================================== */

export const GreenCheckCircleIcon: FC<{ className?: string; title?: string }> = ({
  className,
  title,
}) => (
  <CheckCircleIcon
    className={className}
    color="var(--pf-t--color--green--default, #3e8635)"
    title={title}
  />
);

export const YellowExclamationTriangleIcon: FC<{ className?: string; title?: string; dataTest?: string }> = ({
  className,
  title,
  dataTest,
}) => (
  <ExclamationTriangleIcon
    className={className}
    color="var(--pf-t--color--gold--default, #f0ab00)"
    title={title}
    data-test={dataTest}
  />
);

export const RedExclamationCircleIcon: FC<{ className?: string; title?: string }> = ({
  className,
  title,
}) => (
  <ExclamationCircleIcon
    className={className}
    color="var(--pf-t--color--red--default, #c9190b)"
    title={title}
  />
);

/* ================================================================== */
/*  CamelCaseWrap                                                      */
/* ================================================================== */

export const CamelCaseWrap: FC<{ value: string }> = ({ value }) => {
  if (!value) return null;
  // Insert a zero-width space before each capital letter (except the first)
  const wrapped = value.replace(/([a-z])([A-Z])/g, '$1\u200B$2');
  return <>{wrapped}</>;
};

/* ================================================================== */
/*  Status / StatusIconAndText / SuccessStatus / PopoverStatus         */
/* ================================================================== */

const statusIconMap: Record<string, FC<{ className?: string }>> = {
  Running: () => <CheckCircleIcon color="var(--pf-t--color--green--default, #3e8635)" />,
  Succeeded: () => <CheckCircleIcon color="var(--pf-t--color--green--default, #3e8635)" />,
  Healthy: () => <CheckCircleIcon color="var(--pf-t--color--green--default, #3e8635)" />,
  OK: () => <CheckCircleIcon color="var(--pf-t--color--green--default, #3e8635)" />,
  Available: () => <CheckCircleIcon color="var(--pf-t--color--green--default, #3e8635)" />,
  'Up to date': () => <CheckCircleIcon color="var(--pf-t--color--green--default, #3e8635)" />,
  Completed: () => <CheckCircleIcon color="var(--pf-t--color--green--default, #3e8635)" />,
  Ready: () => <CheckCircleIcon color="var(--pf-t--color--green--default, #3e8635)" />,
  Active: () => <CheckCircleIcon color="var(--pf-t--color--green--default, #3e8635)" />,
  Bound: () => <CheckCircleIcon color="var(--pf-t--color--green--default, #3e8635)" />,
  Pending: () => <InProgressIcon />,
  Updating: () => <SyncAltIcon />,
  'Upgrade available': () => (
    <ArrowCircleUpIcon color="var(--pf-t--color--blue--default, #0066cc)" />
  ),
  Warning: () => (
    <ExclamationTriangleIcon color="var(--pf-t--color--gold--default, #f0ab00)" />
  ),
  Degraded: () => <ExclamationCircleIcon color="var(--pf-t--color--red--default, #c9190b)" />,
  Error: () => <ExclamationCircleIcon color="var(--pf-t--color--red--default, #c9190b)" />,
  Failed: () => <ExclamationCircleIcon color="var(--pf-t--color--red--default, #c9190b)" />,
  CrashLoopBackOff: () => (
    <ExclamationCircleIcon color="var(--pf-t--color--red--default, #c9190b)" />
  ),
  'Not available': () => <BanIcon />,
  Unknown: () => <QuestionCircleIcon />,
};

const getStatusIcon = (status: string): FC<{ className?: string }> =>
  statusIconMap[status] || (() => <QuestionCircleIcon />);

export const StatusIconAndText: FC<{
  title?: string;
  icon?: ReactNode;
  iconOnly?: boolean;
  noIcon?: boolean;
  className?: string;
  spin?: boolean;
}> = ({ title, icon, iconOnly, noIcon, className }) => {
  const StatusIcon = title ? getStatusIcon(title) : null;
  return (
    <span className={className || 'co-icon-and-text'}>
      {!noIcon && (icon || (StatusIcon && <StatusIcon />))}
      {!iconOnly && title && <span className="co-icon-and-text__text">{title}</span>}
    </span>
  );
};

export const Status: FC<{
  status?: string;
  title?: string;
  value?: string;
  children?: ReactNode;
  icon?: ReactNode;
  iconOnly?: boolean;
  noIcon?: boolean;
  className?: string;
}> = ({ status, title, value, children, icon, iconOnly, noIcon, className }) => {
  const displayTitle = title || status || value || '';
  return (
    <span className={className || 'co-icon-and-text'}>
      <StatusIconAndText
        title={displayTitle}
        icon={icon}
        iconOnly={iconOnly}
        noIcon={noIcon}
      />
      {children}
    </span>
  );
};

export const SuccessStatus: FC<{ title?: string }> = ({ title }) => (
  <Status status={title || 'Succeeded'} icon={<GreenCheckCircleIcon />} />
);

export const PopoverStatus: FC<{
  title?: string;
  statusBody?: ReactNode;
  isVisible?: boolean;
  shouldClose?: () => void;
  children?: ReactNode;
}> = ({ title, statusBody, isVisible, shouldClose, children }) => (
  <Popover
    bodyContent={children || statusBody}
    isVisible={isVisible}
    onHide={shouldClose}
  >
    <button type="button" className="pf-v6-c-button pf-m-link pf-m-inline" style={{ padding: 0 }}>
      <StatusIconAndText title={title} />
    </button>
  </Popover>
);

/* ================================================================== */
/*  LazyActionMenu                                                     */
/* ================================================================== */

export const LazyActionMenu: FC<{
  context?: any;
  variant?: ActionMenuVariant;
  label?: string;
  isDisabled?: boolean;
  actions?: Array<{
    id: string;
    label: string;
    cta?: (() => void) | { href: string };
    disabled?: boolean;
    tooltip?: string;
  }>;
}> = ({ actions = [], variant, label: menuLabel, isDisabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const onToggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const onSelect = useCallback(() => setIsOpen(false), []);

  const isKebab = !variant || variant === ActionMenuVariant.KEBAB;

  const toggle = (toggleRef: React.Ref<MenuToggleElement>) =>
    isKebab ? (
      <MenuToggle
        ref={toggleRef}
        variant="plain"
        onClick={onToggle}
        isExpanded={isOpen}
        aria-label="Actions"
      >
        <EllipsisVIcon />
      </MenuToggle>
    ) : (
      <MenuToggle ref={toggleRef} onClick={onToggle} isExpanded={isOpen}>
        Actions
      </MenuToggle>
    );

  return (
    <Dropdown
      isOpen={isOpen}
      onSelect={onSelect}
      onOpenChange={setIsOpen}
      toggle={toggle}
      popperProps={{ position: 'right' }}
    >
      <DropdownList>
        {actions.map((a) => (
          <DropdownItem
            key={a.id}
            onClick={() => {
              if (typeof a.cta === 'function') {
                a.cta();
              } else if (a.cta?.href) {
                window.location.href = a.cta.href;
              }
            }}
            isDisabled={a.disabled}
          >
            {a.label}
          </DropdownItem>
        ))}
      </DropdownList>
    </Dropdown>
  );
};

/* ================================================================== */
/*  ListPageBody                                                       */
/* ================================================================== */

export const ListPageBody: FC<{ children?: ReactNode }> = ({ children }) => (
  <div className="co-m-pane__body">{children}</div>
);

/* ================================================================== */
/*  Functions                                                          */
/* ================================================================== */

/**
 * Build an access-review object for checking permissions.
 */
export const asAccessReview = (
  model: K8sModel,
  obj: K8sResourceCommon,
  verb: string,
  subresource?: string,
): { group: string; resource: string; namespace?: string; name?: string; verb: any } => ({
  group: model.apiGroup || '',
  resource: subresource ? `${model.plural}/${subresource}` : model.plural,
  namespace: obj?.metadata?.namespace,
  name: obj?.metadata?.name,
  verb,
});

/**
 * Build a URL path from a K8s resource object.
 */
export const resourceObjPath = (obj: K8sResourceCommon, kind: string): string => {
  const ns = obj?.metadata?.namespace;
  const name = obj?.metadata?.name;
  const ref = kind || '';
  return ns ? `/k8s/ns/${ns}/${ref}/${name}` : `/k8s/cluster/${ref}/${name}`;
};

/**
 * Build a URL path from a K8sModel.
 */
export const resourcePathFromModel = (
  model: { apiGroup?: string; apiVersion?: string; plural: string },
  name?: string,
  namespace?: string,
): string => {
  const base = namespace
    ? `/k8s/ns/${namespace}/${model.plural}`
    : `/k8s/cluster/${model.plural}`;
  return name ? `${base}/${name}` : base;
};

/**
 * Read user info from the console Redux store.
 */
export const getUser = (): any => {
  try {
    const store = (window as any).__REDUX_STORE__;
    if (store) {
      const state = store.getState();
      // The user info is stored under coreSelectors.getUser / state.sdkCore.user
      return state?.sdkCore?.user ?? state?.UI?.get?.('user') ?? {};
    }
  } catch {
    // ignore
  }
  return {};
};

/**
 * Build a reference string (group~version~kind) from a K8sModel.
 * This is the SDK name for what we already have as `referenceForModel`.
 */
export const getReferenceForModel = (model: K8sModel): string =>
  model.apiGroup
    ? `${model.apiGroup}~${model.apiVersion}~${model.kind}`
    : model.kind;

/**
 * Build a GroupVersionKind object from a model.
 */
export const getGroupVersionKindForModel = (
  model: K8sModel,
): { group: string; version: string; kind: string } => ({
  group: model.apiGroup || '',
  version: model.apiVersion,
  kind: model.kind,
});

/**
 * Promise.allSettled wrapper returning [fulfilled, rejected] arrays.
 */
export const settleAllPromises = <T,>(
  promises: Promise<T>[],
): Promise<[T[], any[]]> =>
  Promise.allSettled(promises).then((results) => {
    const fulfilled: T[] = [];
    const rejected: any[] = [];
    results.forEach((r) => {
      if (r.status === 'fulfilled') {
        fulfilled.push(r.value);
      } else {
        rejected.push(r.reason);
      }
    });
    return [fulfilled, rejected];
  });

/* ================================================================== */
/*  k8sCreateResource / k8sGetResource                                */
/* ================================================================== */

export const k8sCreateResource = ({
  model,
  data,
  queryParams,
}: {
  model: K8sModel;
  data: any;
  queryParams?: Record<string, string>;
}): Promise<any> => {
  const apiGroup = model.apiGroup ? `/apis/${model.apiGroup}` : '/api';
  const ns = data?.metadata?.namespace
    ? `/namespaces/${data.metadata.namespace}`
    : '';
  let url = `${apiGroup}/${model.apiVersion}${ns}/${model.plural}`;
  if (queryParams) {
    const params = new URLSearchParams(queryParams).toString();
    if (params) url += `?${params}`;
  }
  return consoleFetchJSON(url, 'POST', {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};

export const k8sGetResource = ({
  model,
  name,
  ns,
  queryParams,
}: {
  model: K8sModel;
  name: string;
  ns?: string;
  queryParams?: Record<string, string>;
}): Promise<any> => {
  const apiGroup = model.apiGroup ? `/apis/${model.apiGroup}` : '/api';
  const nsPath = ns ? `/namespaces/${ns}` : '';
  let url = `${apiGroup}/${model.apiVersion}${nsPath}/${model.plural}/${name}`;
  if (queryParams) {
    const params = new URLSearchParams(queryParams).toString();
    if (params) url += `?${params}`;
  }
  return consoleFetchJSON(url);
};

/* ================================================================== */
/*  Hooks                                                              */
/* ================================================================== */

/**
 * useAccessReview — check if the current user has a given permission.
 * Returns [isAllowed, loading].
 */
export const useAccessReview = (
  accessReview: {
    group?: string;
    resource?: string;
    verb?: string;
    namespace?: string;
    name?: string;
  },
): [boolean, boolean] => {
  const [isAllowed, setIsAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessReview?.resource || !accessReview?.verb) {
      setIsAllowed(true);
      setLoading(false);
      return;
    }
    const body = {
      apiVersion: 'authorization.k8s.io/v1',
      kind: 'SelfSubjectAccessReview',
      spec: {
        resourceAttributes: {
          group: accessReview.group || '',
          resource: accessReview.resource,
          verb: accessReview.verb,
          namespace: accessReview.namespace,
          name: accessReview.name,
        },
      },
    };
    consoleFetchJSON('/apis/authorization.k8s.io/v1/selfsubjectaccessreviews', 'POST', {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then((result: any) => {
        setIsAllowed(result?.status?.allowed ?? false);
        setLoading(false);
      })
      .catch(() => {
        setIsAllowed(false);
        setLoading(false);
      });
  }, [
    accessReview?.group,
    accessReview?.resource,
    accessReview?.verb,
    accessReview?.namespace,
    accessReview?.name,
  ]);

  return [isAllowed, loading];
};

/**
 * useDeepCompareMemoize — memoize a value by deep equality.
 */
export const useDeepCompareMemoize = <T,>(value: T): T => {
  const ref = useRef<T>(value);

  if (!deepEqual(ref.current, value)) {
    ref.current = value;
  }

  return ref.current;
};

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object') return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) => deepEqual(a[key], b[key]));
}

/**
 * usePoll — run a callback on a regular interval.
 */
export const usePoll = (
  callback: () => void,
  delay: number,
  ...dependencies: any[]
): void => {
  const savedCallback = useRef(callback);
  savedCallback.current = callback;

  useEffect(() => {
    savedCallback.current();
    if (delay <= 0) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, ...dependencies]);
};

/**
 * useConsoleDispatch — dispatch actions to the console Redux store.
 *
 * At runtime the console host exposes the store on `window.__REDUX_STORE__`.
 * We return `store.dispatch` so action creators work as expected.
 */
export const useConsoleDispatch = (): ((action: any) => any) => {
  return useCallback((action: any) => {
    const store = (window as any).__REDUX_STORE__;
    if (store) {
      return store.dispatch(action);
    }
    // eslint-disable-next-line no-console
    console.warn('useConsoleDispatch: Redux store not found');
    return action;
  }, []);
};

/**
 * useConsoleSelector — read from the console Redux store.
 */
export const useConsoleSelector = <T = any>(selector: (state: any) => T): T => {
  const store = (window as any).__REDUX_STORE__;
  const [value, setValue] = useState<T>(() => (store ? selector(store.getState()) : (undefined as any)));

  useEffect(() => {
    if (!store) return;
    const unsubscribe = store.subscribe(() => {
      const next = selector(store.getState());
      setValue((prev: T) => (prev === next ? prev : next));
    });
    // Read current value on mount
    setValue(selector(store.getState()));
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store]);

  return value;
};

/**
 * useActivePerspective — returns the active perspective and a setter.
 * Always returns 'admin' since plugins run in the admin perspective.
 */
export const useActivePerspective = (): [string, (p: string) => void] => {
  return ['admin', () => {}];
};

/**
 * useQueryParamsMutator — hook to read and mutate URL query parameters.
 */
export const useQueryParamsMutator = () => {
  const getQueryArgument = useCallback((key: string): string | null => {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  }, []);

  const setQueryArgument = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set(key, value);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, []);

  const removeQueryArgument = useCallback((key: string) => {
    const params = new URLSearchParams(window.location.search);
    params.delete(key);
    const search = params.toString();
    const newUrl = search
      ? `${window.location.pathname}?${search}`
      : window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  }, []);

  return useMemo(
    () => ({ getQueryArgument, setQueryArgument, removeQueryArgument }),
    [getQueryArgument, setQueryArgument, removeQueryArgument],
  );
};

/**
 * useCreateResourceExtension — returns null (no custom create-resource extension).
 */
export const useCreateResourceExtension = (_resourceGroupVersionKind?: any): null => {
  return null;
};

/**
 * useResourceConnectionHandler — returns a noop handler.
 */
export const useResourceConnectionHandler = (..._args: any[]): any => {
  return undefined;
};
