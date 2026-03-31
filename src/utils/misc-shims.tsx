/**
 * Miscellaneous shims for @console/internal imports that do not fit
 * into the other shim categories.
 */

import type { FC, ReactNode, ComponentType } from 'react';
import { useTranslation } from 'react-i18next';

/* ------------------------------------------------------------------ */
/*  ErrorPage404  — from @console/internal/components/error            */
/* ------------------------------------------------------------------ */

export const ErrorPage404: FC<{ bodyText?: string }> = ({ bodyText }) => {
  const { t } = useTranslation();
  return (
    <div className="co-m-pane__body" data-test="error-page-404">
      <h1>{t('public~404: Page Not Found')}</h1>
      {bodyText && <p>{bodyText}</p>}
    </div>
  );
};
ErrorPage404.displayName = 'ErrorPage404';

/* ------------------------------------------------------------------ */
/*  ResourceEventStream — from @console/internal/components/events     */
/* ------------------------------------------------------------------ */

/**
 * Stub ResourceEventStream.
 * TODO: replace with SDK EventsList or equivalent.
 */
export const ResourceEventStream: FC<{ resource?: any; [key: string]: any }> = () => {
  return null as any;
};
ResourceEventStream.displayName = 'ResourceEventStream';

/* ------------------------------------------------------------------ */
/*  NamespaceBar — from @console/internal/components/namespace-bar     */
/* ------------------------------------------------------------------ */

/**
 * Stub NamespaceBar.
 * TODO: replace with SDK NamespaceBar or project-specific equivalent.
 */
export const NamespaceBar: FC<{
  children?: ReactNode;
  disabled?: boolean;
  onNamespaceChange?: (ns: string) => void;
  [key: string]: any;
}> = ({ children }) => <div className="co-namespace-bar">{children}</div>;
NamespaceBar.displayName = 'NamespaceBar';

/* ------------------------------------------------------------------ */
/*  SecretValue — from @console/internal/components/configmap-and-secret-data */
/* ------------------------------------------------------------------ */

export const SecretValue: FC<{
  value: string;
  encoded?: boolean;
  reveal?: boolean;
}> = ({ value, reveal }) => {
  if (!reveal) return <span>*****</span>;
  return <span className="co-pre-wrap">{value}</span>;
};
SecretValue.displayName = 'SecretValue';

/* ------------------------------------------------------------------ */
/*  ManagedByOperatorLink / ManagedByOperatorResourceLink              */
/*  from @console/internal/components/utils/managed-by                 */
/* ------------------------------------------------------------------ */

export const ManagedByOperatorLink: FC<{ obj: any }> = () => null;
ManagedByOperatorLink.displayName = 'ManagedByOperatorLink';

export const ManagedByOperatorResourceLink: FC<{ obj: any }> = () => null;
ManagedByOperatorResourceLink.displayName = 'ManagedByOperatorResourceLink';

/* ------------------------------------------------------------------ */
/*  TileViewPage — from @console/internal/components/utils/tile-view-page */
/* ------------------------------------------------------------------ */

/**
 * Stub TileViewPage.
 * TODO: replace with PatternFly catalog view or custom implementation.
 */
export const TileViewPage: FC<any> = (props) => {
  return null as any;
};
TileViewPage.displayName = 'TileViewPage';

/* ------------------------------------------------------------------ */
/*  connectToModel — from @console/internal/kinds                      */
/* ------------------------------------------------------------------ */

/**
 * Redux connect wrapper that injects `kindObj` based on the `kind` prop.
 * TODO: replace usage sites with useK8sModel hook.
 */
export const connectToModel = (component: ComponentType<any>): ComponentType<any> => component;

/* ------------------------------------------------------------------ */
/*  getResources — from @console/internal/actions/k8s                  */
/* ------------------------------------------------------------------ */

/**
 * Redux thunk that fetches the API resource list.
 * TODO: replace with SDK hook or remove.
 */
export const getResources = () => (_dispatch: any) => {
  // no-op in plugin context; the host app handles discovery
};

/* ------------------------------------------------------------------ */
/*  coFetchJSON — from @console/internal/co-fetch                      */
/* ------------------------------------------------------------------ */

export { consoleFetchJSON as coFetchJSON } from '@openshift-console/dynamic-plugin-sdk';

/* ------------------------------------------------------------------ */
/*  authSvc — from @console/internal/module/auth                       */
/* ------------------------------------------------------------------ */

/**
 * Minimal authSvc shim.
 * TODO: replace with SDK user info or remove.
 */
export const authSvc = {
  userID: (): string | undefined => undefined,
  name: (): string | undefined => undefined,
  email: (): string | undefined => undefined,
  logoutRedirect: (_next?: string) => {
    window.location.assign('/oauth/sign_in');
  },
  logout: (next?: string) => {
    authSvc.logoutRedirect(next);
  },
};

/* ------------------------------------------------------------------ */
/*  RadioGroupItems type — from @console/internal/components/radio     */
/* ------------------------------------------------------------------ */

export type RadioGroupItems = {
  title: string;
  value: string;
  desc?: string;
  disabled?: boolean;
}[];
