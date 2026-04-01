import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CommonActionCreator, useCommonActions, useCommonResourceActions } from '../../../lib/action-hooks';
import type { Action } from '@openshift-console/dynamic-plugin-sdk';
import { useOverlay } from '../../../lib/modals';
import { asAccessReview } from '../../../lib/sdk-compat';
import { referenceFor } from '../../../lib/k8s';
import { useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import { LazyDisableDefaultSourceModalOverlay } from '../../components/modals';
import type { OperatorHubKind } from '../../components/operator-hub';
import { DEFAULT_SOURCE_NAMESPACE } from '../../const';
import { OperatorHubModel } from '../../models';
import type { CatalogSourceKind } from '../../types';
import useOperatorHubConfig from '../../utils/useOperatorHubConfig';

const useDisableSourceAction = (operatorHub: OperatorHubKind, sourceName: string): Action[] => {
  const { t } = useTranslation();
  const launchModal = useOverlay();
  const factory = useMemo(
    () => ({
      disableSource: () => ({
        id: 'disable-source',
        label: t('olm~Disable'),
        cta: () =>
          launchModal(LazyDisableDefaultSourceModalOverlay, {
            kind: OperatorHubModel,
            operatorHub,
            sourceName,
          }),
        accessReview: asAccessReview(OperatorHubModel, operatorHub, 'patch'),
      }),
    }),
    [t, operatorHub, sourceName, launchModal],
  );
  const action = useMemo(() => [factory.disableSource()], [factory]);
  return action;
};

export const useCatalogSourceActionsProvider = (catalogSource: CatalogSourceKind) => {
  const [operatorHub, operatorHubLoaded, operatorHubLoadError] = useOperatorHubConfig();
  const [kindObj, inFlight] = useK8sModel(referenceFor(catalogSource));
  const sourceName = catalogSource?.metadata?.name;
  const namespace = catalogSource?.metadata?.namespace;
  const disableSourceAction = useDisableSourceAction(operatorHub, sourceName);
  const commonActions = useCommonResourceActions(kindObj, catalogSource);
  const [editAction, isReady] = useCommonActions(kindObj, catalogSource, [
    CommonActionCreator.Edit,
  ]);
  const commonEditAction = useMemo(() => (isReady ? Object.values(editAction) : []), [
    editAction,
    isReady,
  ]);
  const isDefaultSource = useMemo(
    () =>
      DEFAULT_SOURCE_NAMESPACE === namespace &&
      operatorHub?.status?.sources?.some((source) => source.name === sourceName),
    [sourceName, namespace, operatorHub?.status?.sources],
  );
  const actions = useMemo(
    () => (isDefaultSource ? [...commonEditAction, ...disableSourceAction] : [...commonActions]),
    [commonActions, commonEditAction, isDefaultSource, disableSourceAction],
  );
  return useMemo(
    () => [operatorHubLoaded && !operatorHubLoadError ? actions : [], !inFlight, undefined],
    [operatorHubLoaded, operatorHubLoadError, actions, inFlight],
  );
};

export const catalogSourceActionsProvider = {
  useCatalogSourceActionsProvider,
};
