/**
 * Shims for @console/internal/components/modals/*.
 *
 * Provides inline replacements for modal components that were previously
 * imported from the console internal package.
 */

import type { FC, ReactNode } from 'react';
import { useState, useCallback } from 'react';
import {
  Button,
  ButtonVariant,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  Radio,
  FormGroup,
  NumberInput,
} from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import type { OverlayComponent } from '@openshift-console/dynamic-plugin-sdk/src/app/modal-support/OverlayProvider';
import { useOverlay } from '@openshift-console/dynamic-plugin-sdk/src/app/modal-support/useOverlay';
export type { OverlayComponent };
export { useOverlay };
import type { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import type { ModalComponentProps } from './shared-types';

/* ------------------------------------------------------------------ */
/*  ErrorModal                                                         */
/* ------------------------------------------------------------------ */

export type ErrorModalProps = {
  error: string | ReactNode;
  title?: string;
} & ModalComponentProps;

export const ErrorModal: OverlayComponent<ErrorModalProps> = (props) => {
  const { t } = useTranslation();
  const { error, title } = props;
  const titleText = title || t('public~Error');
  return (
    <Modal
      isOpen
      onClose={props.closeOverlay}
      variant={ModalVariant.small}
      aria-labelledby="error-modal-title"
    >
      <ModalHeader title={titleText} titleIconVariant="warning" labelId="error-modal-title" />
      <ModalBody>{error}</ModalBody>
      <ModalFooter>
        <Button key="cancel" variant={ButtonVariant.primary} onClick={props.closeOverlay}>
          {t('public~OK')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
ErrorModal.displayName = 'ErrorModal';

export const useErrorModalLauncher = (
  props?: Partial<ErrorModalProps>,
): ((overrides?: ErrorModalProps) => void) => {
  const launcher = useOverlay();
  return useCallback(
    (overrides?: ErrorModalProps) => {
      const mergedProps: ErrorModalProps = {
        error: '',
        ...(props || {}),
        ...(overrides || {}),
      };
      launcher<ErrorModalProps>(ErrorModal, mergedProps);
    },
    [launcher, props],
  );
};

/* ------------------------------------------------------------------ */
/*  DeleteModalOverlay / DeleteModalProps                               */
/* ------------------------------------------------------------------ */

export type DeleteModalProps = {
  kind: any;
  resource: K8sResourceCommon;
  redirectTo?: any;
  message?: JSX.Element;
  btnText?: ReactNode;
  deleteAllResources?: () => Promise<K8sResourceCommon[]>;
} & ModalComponentProps;

export const DeleteModalOverlay: OverlayComponent<DeleteModalProps> = (props) => {
  // The real implementation lives in the console host and is shared via
  // module federation.  This stub allows standalone compilation.
  const [isOpen, setIsOpen] = useState(true);
  const { t } = useTranslation();
  const handleClose = () => {
    setIsOpen(false);
    props.closeOverlay();
  };

  if (!isOpen) return null;
  return (
    <Modal variant={ModalVariant.small} isOpen onClose={handleClose}>
      <ModalHeader title={t('public~Delete {{kind}}', { kind: props.kind?.label || 'Resource' })} />
      <ModalBody>
        {props.message || t('public~Are you sure you want to delete?')}
      </ModalBody>
      <ModalFooter>
        <Button variant="danger" onClick={handleClose}>
          {props.btnText || t('public~Delete')}
        </Button>
        <Button variant="link" onClick={handleClose}>
          {t('public~Cancel')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
DeleteModalOverlay.displayName = 'DeleteModalOverlay';

/* ------------------------------------------------------------------ */
/*  ConfigureUpdateStrategy / getNumberOrPercent                       */
/* ------------------------------------------------------------------ */

export const getNumberOrPercent = (value: string | number): string | number => {
  if (typeof value === 'string' && value.endsWith('%')) {
    return value;
  }
  return Number.isNaN(Number(value)) ? value : Number(value);
};

export type ConfigureUpdateStrategyProps = {
  strategyType: string;
  maxUnavailable: string | number;
  maxSurge: string | number;
  onChangeStrategyType: (type: string) => void;
  onChangeMaxUnavailable: (value: string) => void;
  onChangeMaxSurge: (value: string) => void;
};

export const ConfigureUpdateStrategy: FC<ConfigureUpdateStrategyProps> = ({
  strategyType,
  maxUnavailable,
  maxSurge,
  onChangeStrategyType,
  onChangeMaxUnavailable,
  onChangeMaxSurge,
}) => {
  const { t } = useTranslation();
  return (
    <div>
      <FormGroup label={t('public~Strategy type')} fieldId="strategy-type">
        <Radio
          name="strategy-type"
          id="rolling-update"
          label={t('public~RollingUpdate')}
          isChecked={strategyType === 'RollingUpdate'}
          onChange={() => onChangeStrategyType('RollingUpdate')}
        />
        <Radio
          name="strategy-type"
          id="recreate"
          label={t('public~Recreate')}
          isChecked={strategyType === 'Recreate'}
          onChange={() => onChangeStrategyType('Recreate')}
        />
      </FormGroup>
      {strategyType === 'RollingUpdate' && (
        <>
          <FormGroup label={t('public~Max unavailable')} fieldId="max-unavailable">
            <input
              type="text"
              id="max-unavailable"
              value={maxUnavailable}
              onChange={(e) => onChangeMaxUnavailable(e.target.value)}
              className="pf-v6-c-form-control"
            />
          </FormGroup>
          <FormGroup label={t('public~Max surge')} fieldId="max-surge">
            <input
              type="text"
              id="max-surge"
              value={maxSurge}
              onChange={(e) => onChangeMaxSurge(e.target.value)}
              className="pf-v6-c-form-control"
            />
          </FormGroup>
        </>
      )}
    </div>
  );
};
ConfigureUpdateStrategy.displayName = 'ConfigureUpdateStrategy';

/* ------------------------------------------------------------------ */
/*  useConfigureCountModal                                             */
/* ------------------------------------------------------------------ */

export type ConfigureCountModalProps = {
  resourceKind: any;
  resource: K8sResourceCommon;
  defaultValue: number;
  titleKey?: string;
  titleVariables?: Record<string, string>;
  message?: string;
  path: string;
  buttonTextKey?: string;
  buttonTextVariables?: Record<string, string>;
} & Partial<ModalComponentProps>;

/**
 * Stub for useConfigureCountModal.
 * TODO: implement using PatternFly Modal + NumberInput.
 */
export const useConfigureCountModal = (_baseProps?: Partial<ConfigureCountModalProps>) => {
  return useCallback(() => {
    // eslint-disable-next-line no-console
    console.warn('useConfigureCountModal: stub — modal not implemented yet');
  }, []);
};

/* ------------------------------------------------------------------ */
/*  LazyConsolePluginModalOverlay                                      */
/*  Migrated from @console/shared/src/components/modals               */
/*  Modal for managing (enabling/disabling) console plugins.           */
/* ------------------------------------------------------------------ */

export type ConsolePluginModalOverlayProps = {
  consoleOperatorConfig: K8sResourceCommon;
  csvPluginsCount: number;
  pluginName: string;
  trusted?: boolean;
} & Partial<ModalComponentProps>;

/**
 * A modal overlay for enabling/disabling a console plugin.
 * TODO: Implement the full plugin enable/disable workflow with
 * k8s PATCH to the console operator config resource.
 */
export const LazyConsolePluginModalOverlay: OverlayComponent<ConsolePluginModalOverlayProps> = (
  props,
) => {
  const { t } = useTranslation();
  const { pluginName } = props;

  return (
    <Modal isOpen onClose={props.closeOverlay} variant={ModalVariant.small}>
      <ModalHeader
        title={t('olm~Console plugin enablement')}
        labelId="console-plugin-modal-title"
      />
      <ModalBody>
        {/* TODO: Implement full console plugin enable/disable form with
            ConsolePluginRadioInputs, ConsolePluginWarning, and k8s PATCH logic */}
        <p>
          {t('olm~Manage console plugin "{{pluginName}}".', { pluginName })}
        </p>
      </ModalBody>
      <ModalFooter>
        <Button variant={ButtonVariant.primary} onClick={props.closeOverlay}>
          {t('olm~Save')}
        </Button>
        <Button variant={ButtonVariant.link} onClick={props.closeOverlay}>
          {t('olm~Cancel')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
LazyConsolePluginModalOverlay.displayName = 'LazyConsolePluginModalOverlay';
