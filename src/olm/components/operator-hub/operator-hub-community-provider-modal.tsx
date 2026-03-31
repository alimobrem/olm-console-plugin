import type { FC } from 'react';
import { useState, useCallback } from 'react';
import {
  Button,
  Checkbox,
  Content,
  ContentVariants,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
} from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import type { OverlayComponent } from '../../lib/modals';
import { RH_OPERATOR_SUPPORT_POLICY_LINK } from '../../../lib/olm-constants';
import { ExternalLink } from '../ExternalLink';
import type { ModalComponentProps } from '../../../lib/types';

export const OperatorHubCommunityProviderModal: FC<OperatorHubCommunityProviderModalProps> = ({
  close,
  cancel,
  showCommunityOperators,
}) => {
  const { t } = useTranslation();
  const [ignoreWarnings, setIgnoreWarnings] = useState(false);
  const submit = useCallback(
    (event) => {
      event.preventDefault();
      close();
      showCommunityOperators(ignoreWarnings);
    },
    [close, ignoreWarnings, showCommunityOperators],
  );

  return (
    <>
      <ModalHeader
        title={t('olm~Show community Operator')}
        titleIconVariant="info"
        data-test-id="modal-title"
        labelId="community-operator-warning-modal-title"
      />
      <ModalBody>
        <Form id="community-provider-form" onSubmit={submit}>
          <Content component={ContentVariants.p}>
            {t(
              'olm~Community Operators are Operators which have not been vetted or verified by Red Hat. Community Operators should be used with caution because their stability is unknown. Red Hat provides no support for community Operators.',
            )}
          </Content>
          {RH_OPERATOR_SUPPORT_POLICY_LINK && (
            <Content component={ContentVariants.p}>
              <ExternalLink
                href={RH_OPERATOR_SUPPORT_POLICY_LINK}
                text={t('olm~Learn more about Red Hat’s third party software support policy')}
              />
            </Content>
          )}
          <Checkbox
            className="co-modal-ignore-warning__checkbox"
            onChange={(_event, value) => setIgnoreWarnings(value)}
            isChecked={ignoreWarnings}
            data-checked-state={ignoreWarnings}
            id="do-not-show-warning"
            label={t('olm~Do not show this warning again')}
          />
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          type="submit"
          variant="primary"
          form="community-provider-form"
          data-test="confirm-action"
          id="confirm-action"
        >
          {t('olm~Continue')}
        </Button>
        <Button variant="link" onClick={cancel} data-test-id="modal-cancel-action">
          {t('public~Cancel')}
        </Button>
      </ModalFooter>
    </>
  );
};

export type OperatorHubCommunityProviderModalProps = {
  showCommunityOperators: (ignoreWarnings: boolean) => void;
} & ModalComponentProps;

export const CommunityOperatorWarningModalOverlay: OverlayComponent<OperatorHubCommunityProviderModalProps> = (
  props,
) => {
  return (
    <Modal
      variant={ModalVariant.small}
      isOpen
      onClose={props.closeOverlay}
      aria-labelledby="community-operator-warning-modal-title"
    >
      <OperatorHubCommunityProviderModal
        {...props}
        close={props.closeOverlay}
        cancel={props.closeOverlay}
      />
    </Modal>
  );
};
