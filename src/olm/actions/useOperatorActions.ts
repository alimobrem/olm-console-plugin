import { useMemo } from 'react';
import * as _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { K8S_VERB_DELETE, asAccessReview, resourceObjPath } from '../../lib/sdk-compat';
import type { Action } from '@openshift-console/dynamic-plugin-sdk';
import { useOverlay } from '../../lib/modals';
import { DeleteModalOverlay } from '../../lib/modals';
import { referenceFor } from '../../lib/k8s';
import { useUninstallOperatorModal } from '../components/modals/uninstall-operator-modal';
import { ClusterServiceVersionModel, SubscriptionModel } from '../models';

const useOperatorActions = ({ resource, subscription }): [Action[], boolean, any] => {
  const { t } = useTranslation();
  const launchModal = useOverlay();

  const uninstallOperatorModal = useUninstallOperatorModal(subscription, resource);

  const actions = useMemo(() => {
    if (!resource) {
      return [];
    }

    if (_.isEmpty(subscription)) {
      return [
        {
          id: 'delete-csv',
          label: t('public~Delete {{kind}}', { kind: ClusterServiceVersionModel.label }),
          cta: () =>
            launchModal(DeleteModalOverlay, {
              kind: ClusterServiceVersionModel,
              resource,
            }),
          accessReview: asAccessReview(ClusterServiceVersionModel, resource, K8S_VERB_DELETE),
        },
      ];
    }

    return [
      {
        id: 'edit-subscription',
        label: t('olm~Edit Subscription'),
        cta: {
          href: `${resourceObjPath(subscription, referenceFor(subscription))}/yaml`,
        },
      },
      {
        id: 'uninstall-operator',
        label: t('olm~Uninstall Operator'),
        cta: () => uninstallOperatorModal(),
        accessReview: asAccessReview(SubscriptionModel, subscription, K8S_VERB_DELETE),
      },
    ];
  }, [resource, subscription, t, launchModal, uninstallOperatorModal]);
  return [actions, true, null];
};

export default useOperatorActions;
