import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { K8S_VERB_DELETE, K8S_VERB_UPDATE } from '@openshift-console/dynamic-plugin-sdk/src/api/constants';
import type { Action } from '@openshift-console/dynamic-plugin-sdk/src/lib-core';
import { useOverlay } from '@openshift-console/dynamic-plugin-sdk/src/lib-core';
import type { DeleteModalProps } from '../../utils/modal-shims';
import { DeleteModalOverlay } from '../../utils/modal-shims';
import { asAccessReview } from '@openshift-console/dynamic-plugin-sdk';
import { referenceFor } from '../../utils/k8s-shims';
import { useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import { csvNameFromWindow } from '../components/operand/operand-link';
import { ClusterServiceVersionModel } from '../models';

const useDefaultOperandActions = ({ csvName, resource }): [Action[], boolean, any] => {
  const { t } = useTranslation();
  const [k8sModel, inFlight] = useK8sModel(referenceFor(resource));
  const launchModal = useOverlay();
  const actions = useMemo(
    () =>
      resource && k8sModel
        ? [
            {
              id: 'edit-operand',
              label: t('olm~Edit {{item}}', { item: k8sModel.label }),
              cta: {
                href: k8sModel.namespaced
                  ? `/k8s/ns/${resource.metadata.namespace}/${ClusterServiceVersionModel.plural}/${
                      csvName || csvNameFromWindow()
                    }/${referenceFor(resource)}/${resource.metadata.name}/yaml`
                  : `/k8s/cluster/${referenceFor(resource)}/${resource.metadata.name}/yaml`,
              },
              accessReview: asAccessReview(k8sModel, resource, K8S_VERB_UPDATE),
            },
            {
              id: 'delete-operand',
              label: t('olm~Delete {{item}}', { item: k8sModel.label }),
              cta: () =>
                launchModal<DeleteModalProps>(DeleteModalOverlay, {
                  kind: k8sModel,
                  resource,
                  redirectTo: `/k8s/ns/${resource.metadata.namespace}/${
                    ClusterServiceVersionModel.plural
                  }/${csvName || csvNameFromWindow()}/${referenceFor(resource)}`,
                }),
              accessReview: asAccessReview(k8sModel, resource, K8S_VERB_DELETE),
            },
          ]
        : [],
    [csvName, k8sModel, resource, launchModal, t],
  );

  return useMemo(() => [actions, !inFlight, undefined], [actions, inFlight]);
};

export default useDefaultOperandActions;
