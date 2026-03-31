/**
 * Shims for @console/app imports.
 *
 * These are inline versions of hooks and types that were previously
 * imported from @console/app (console-app package).
 */
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Action, K8sModel, K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { useOverlay } from './modals';
import { useDeepCompareMemoize } from './sdk-compat';
import {
  LazyAnnotationsModalOverlay,
  LazyDeleteModalOverlay,
  LazyLabelsModalOverlay,
  LazyTaintsModalOverlay,
  LazyTolerationsModalOverlay,
} from './modals';
import { useConfigureCountModal } from './modals';
import { asAccessReview } from './sdk-compat';
import { useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import { referenceFor, resourceObjPath } from './k8s';

// ---------------------------------------------------------------------------
// Types from @console/app/src/actions/hooks/types
// ---------------------------------------------------------------------------

export type ActionObject<T extends readonly PropertyKey[]> = {
  [K in T[number]]: Action;
};

export enum CommonActionCreator {
  Delete = 'Delete',
  Edit = 'Edit',
  ModifyLabels = 'ModifyLabels',
  ModifyAnnotations = 'ModifyAnnotations',
  ModifyCount = 'ModifyCount',
  ModifyPodSelector = 'ModifyPodSelector',
  ModifyTolerations = 'ModifyTolerations',
  ModifyTaints = 'ModifyTaints',
  AddStorage = 'AddStorage',
}

// ---------------------------------------------------------------------------
// useCommonActions - from @console/app/src/actions/hooks/useCommonActions
// ---------------------------------------------------------------------------

type K8sResourceKind = K8sResourceCommon & { [key: string]: any };
type NodeKind = K8sResourceKind;

export const useCommonActions = <T extends readonly CommonActionCreator[]>(
  kind: K8sModel | undefined,
  resource: K8sResourceKind | undefined,
  filterActions?: T,
  message?: JSX.Element,
  editPath?: string,
): [ActionObject<T>, boolean] => {
  const { t } = useTranslation();
  const launchModal = useOverlay();
  const launchCountModal = useConfigureCountModal({
    resourceKind: kind,
    resource,
    defaultValue: 0,
    titleKey: 'public~Edit Pod count',
    labelKey: kind?.labelPluralKey,
    messageKey: 'public~{{resourceKinds}} maintain the desired number of healthy pods.',
    messageVariables: { resourceKinds: kind?.labelPlural },
    path: '/spec/replicas',
    buttonTextKey: 'public~Save',
    opts: { path: 'scale' },
  });

  const memoizedFilterActions = useDeepCompareMemoize(filterActions);

  const actualEditPath = useMemo(() => {
    if (editPath) {
      return editPath;
    }
    if (!kind || !resource) {
      return '';
    }
    const reference = kind.crd ? referenceFor(resource) : kind.kind;
    return `${resourceObjPath(resource, reference)}/yaml`;
  }, [kind, resource, editPath]);

  const factory = useMemo(
    () => ({
      [CommonActionCreator.Delete]: (): Action => ({
        id: 'delete-resource',
        label: t('console-app~Delete {{kind}}', { kind: kind?.kind }),
        cta: () =>
          launchModal(LazyDeleteModalOverlay, {
            kind,
            resource,
            message,
          }),
        accessReview: asAccessReview(kind as K8sModel, resource as K8sResourceKind, 'delete'),
      }),
      [CommonActionCreator.Edit]: (): Action => {
        return {
          id: 'edit-resource',
          label: t('console-app~Edit {{kind}}', { kind: kind?.kind }),
          cta: {
            href: actualEditPath,
          },
          accessReview: asAccessReview(kind as K8sModel, resource as K8sResourceKind, 'update'),
        };
      },
      [CommonActionCreator.ModifyLabels]: (): Action => ({
        id: 'edit-labels',
        label: t('console-app~Edit labels'),
        cta: () =>
          launchModal(LazyLabelsModalOverlay, {
            kind,
            resource,
          }),
        accessReview: asAccessReview(kind as K8sModel, resource as K8sResourceKind, 'patch'),
      }),
      [CommonActionCreator.ModifyAnnotations]: (): Action => ({
        id: 'edit-annotations',
        label: t('console-app~Edit annotations'),
        cta: () =>
          launchModal(LazyAnnotationsModalOverlay, {
            kind,
            resource,
          }),
        accessReview: asAccessReview(kind as K8sModel, resource as K8sResourceKind, 'patch'),
      }),
      [CommonActionCreator.ModifyCount]: (): Action => ({
        id: 'edit-pod-count',
        label: t('console-app~Edit Pod count'),
        cta: launchCountModal,
        accessReview: asAccessReview(
          kind as K8sModel,
          resource as K8sResourceKind,
          'patch',
          'scale',
        ),
      }),
      [CommonActionCreator.ModifyTolerations]: (): Action => ({
        id: 'edit-toleration',
        label: t('console-app~Edit tolerations'),
        cta: () =>
          launchModal(LazyTolerationsModalOverlay, {
            resourceKind: kind,
            resource,
          }),
        accessReview: asAccessReview(kind as K8sModel, resource as K8sResourceKind, 'patch'),
      }),
      [CommonActionCreator.ModifyTaints]: (): Action => ({
        id: 'edit-taints',
        label: t('console-app~Edit taints'),
        cta: () =>
          launchModal(LazyTaintsModalOverlay, {
            resourceKind: kind,
            resource: resource as NodeKind,
          }),
        accessReview: asAccessReview(kind as K8sModel, resource as K8sResourceKind, 'patch'),
      }),
      [CommonActionCreator.AddStorage]: (): Action => ({
        id: 'add-storage',
        label: t('console-app~Add storage'),
        cta: {
          href: `${resourceObjPath(
            resource as K8sResourceKind,
            kind?.crd ? referenceFor(resource as K8sModel) : (kind?.kind as string),
          )}/attach-storage`,
        },
        accessReview: asAccessReview(kind as K8sModel, resource as K8sResourceKind, 'patch'),
      }),
    }),
    [kind, resource, t, message, actualEditPath, launchModal, launchCountModal],
  );

  const result = useMemo((): [ActionObject<T>, boolean] => {
    const actions = {} as ActionObject<T>;

    if (!kind || !resource) {
      return [actions, false];
    }

    const actionsToInclude = memoizedFilterActions || Object.values(CommonActionCreator);

    actionsToInclude.forEach((actionType) => {
      if (factory[actionType]) {
        actions[actionType] = factory[actionType]();
      }
    });

    return [actions, true];
  }, [factory, memoizedFilterActions, kind, resource]);

  return result;
};

// ---------------------------------------------------------------------------
// useCommonResourceActions - from @console/app/src/actions/hooks/useCommonResourceActions
// ---------------------------------------------------------------------------

export const useCommonResourceActions = (
  kind: K8sModel | undefined,
  resource: K8sResourceKind | undefined,
  message?: JSX.Element,
  editPath?: string,
): Action[] => {
  const [actions, isReady] = useCommonActions(
    kind,
    resource,
    [
      CommonActionCreator.ModifyLabels,
      CommonActionCreator.ModifyAnnotations,
      CommonActionCreator.Edit,
      CommonActionCreator.Delete,
    ] as const,
    message,
    editPath,
  );
  return useMemo(() => (isReady ? Object.values(actions) : []), [actions, isReady]);
};

// ---------------------------------------------------------------------------
// useDefaultActionsProvider - from @console/app/src/actions/providers/default-provider
// ---------------------------------------------------------------------------

export const useDefaultActionsProvider = (
  resource: K8sResourceCommon,
): [Action[], boolean, Error] => {
  const [kindObj, inFlight] = useK8sModel(referenceFor(resource));
  const commonActions = useCommonResourceActions(kindObj, resource);

  const actions = useMemo(() => [...commonActions], [commonActions]);

  return [actions, !inFlight, (undefined as unknown) as Error];
};
