import { useCallback } from 'react';
import { useOverlay } from '../../lib/modals';
import i18n from 'i18next';
import type { K8sModel, K8sResourceKind } from '../../../../lib/k8s';
import { LazyUpdateStrategyModalOverlay } from '../../modals';
import type { Descriptor } from '../types';
import { getPatchPathFromDescriptor } from '../utils';

export const useConfigureUpdateStrategyModal = ({
  kindObj,
  resource,
  specDescriptor,
  specValue,
}: ConfigureUpdateStrategyModalProps) => {
  const launchModal = useOverlay();

  return useCallback(() => {
    return launchModal(LazyUpdateStrategyModalOverlay, {
      resourceKind: kindObj,
      resource,
      defaultValue: specValue,
      title: i18n.t('olm~Edit {{item}}', { item: specDescriptor.displayName }),
      path: `/spec/${getPatchPathFromDescriptor(specDescriptor)}`,
    });
  }, [launchModal, kindObj, resource, specValue, specDescriptor]);
};

type ConfigureUpdateStrategyModalProps = {
  kindObj: K8sModel;
  resource: K8sResourceKind;
  specDescriptor: Descriptor;
  specValue: any;
};
