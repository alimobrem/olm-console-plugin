import type { FC } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
} from '@patternfly/react-core';
import { safeDump } from 'js-yaml';
import { useTranslation } from 'react-i18next';
import type { OverlayComponent } from '../../../lib/modals';
import { ResourceLink, CopyToClipboard } from '../../../lib/console-components';
import type { ModalComponentProps } from '../../../lib/types';
import type { StepResource } from '../../types';
import { referenceForStepResource } from '../index';

export const InstallPlanPreview: FC<InstallPlanPreviewModalProps> = ({ cancel, stepResource }) => {
  const { t } = useTranslation();
  return (
    <>
      <ModalHeader
        title={
          <>
            {t('olm~InstallPlan Preview')}{' '}
            <ResourceLink
              linkTo={false}
              name={stepResource.name}
              kind={referenceForStepResource(stepResource)}
            />
          </>
        }
        data-test-id="modal-title"
        labelId="installplan-preview-modal-title"
      />
      <ModalBody>
        <CopyToClipboard value={safeDump(JSON.parse(stepResource.manifest))} />
      </ModalBody>
      <ModalFooter>
        <Button variant="primary" onClick={() => cancel()}>
          {t('public~OK')}
        </Button>
      </ModalFooter>
    </>
  );
};

export type InstallPlanPreviewModalProps = {
  stepResource: StepResource;
} & ModalComponentProps;

export const InstallPlanPreviewModalOverlay: OverlayComponent<InstallPlanPreviewModalProps> = (
  props,
) => {
  return (
    <Modal
      variant={ModalVariant.medium}
      isOpen
      onClose={props.closeOverlay}
      aria-labelledby="installplan-preview-modal-title"
    >
      <InstallPlanPreview {...props} cancel={props.closeOverlay} close={props.closeOverlay} />
    </Modal>
  );
};

InstallPlanPreview.displayName = 'InstallPlanPreview';
