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
} from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import type { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';

// OverlayComponent type — matches the SDK's overlay pattern
export type OverlayComponent<P = {}> = FC<P & { closeOverlay: () => void }>;

export type ModalComponentProps = {
  closeOverlay: () => void;
};

// Simple overlay launcher hook
export const useOverlay = () => {
  return useCallback(
    <P extends object>(Component: OverlayComponent<P>, props: P) => {
      // In the real console host, this opens the overlay via module federation.
      // This stub logs a warning for standalone dev.
      // eslint-disable-next-line no-console
      console.warn('useOverlay: stub — overlay not fully implemented in standalone mode');
    },
    [],
  );
};

/* ------------------------------------------------------------------ */
/*  ErrorModal                                                         */
/* ------------------------------------------------------------------ */

export type ErrorModalProps = {
  error: string | ReactNode;
  title?: string;
} & Partial<ModalComponentProps>;

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
} & Partial<ModalComponentProps>;

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
  replicas?: number;
  uid?: string;
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
  labelKey?: string;
  message?: string;
  messageKey?: string;
  messageVariables?: Record<string, any>;
  path: string;
  buttonTextKey?: string;
  buttonTextVariables?: Record<string, string>;
  opts?: { path?: string };
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

/* ------------------------------------------------------------------ */
/*  Lazy modal overlay stubs                                           */
/*  These are placeholders for modals provided by the console host.    */
/* ------------------------------------------------------------------ */

export const LazyAnnotationsModalOverlay: OverlayComponent<any> = ({ closeOverlay }) => null;
export const LazyDeleteModalOverlay: OverlayComponent<any> = ({ closeOverlay }) => null;
export const LazyLabelsModalOverlay: OverlayComponent<any> = ({ closeOverlay }) => null;
export const LazyTaintsModalOverlay: OverlayComponent<any> = ({ closeOverlay }) => null;
export const LazyTolerationsModalOverlay: OverlayComponent<any> = ({ closeOverlay }) => null;
