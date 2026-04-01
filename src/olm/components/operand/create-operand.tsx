import type { FC } from 'react';
import { useState, useMemo, useCallback } from 'react';
import type { JSONSchema7 } from 'json-schema';
import * as _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useActivePerspective } from '../../../lib/sdk-compat';
import {
  StatusBox,
  resourcePathFromModel,
  AsyncComponent,
} from '../../../lib/console-components';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { CustomResourceDefinitionModel } from '../../../lib/models';
import type { K8sResourceKind, CustomResourceDefinitionKind } from '../../../lib/k8s';
import { kindForReference, nameForModel, definitionFor } from '../../../lib/k8s';
import { DocumentTitle } from '../DocumentTitle';
import {
  getSchemaErrors,
  hasNoFields,
  prune,
} from '../../../lib/dynamic-form-utils';
import { PageHeading } from '../PageHeading';
import { SyncedEditor } from '../../../lib/editor-toggle';
import { EditorType } from '../../../lib/editor-toggle';
import { useCreateResourceExtension } from '../../../lib/sdk-compat';
import { useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import type { RouteParams } from '../../../lib/types';
import { exampleForModel, providedAPIForModel } from '..';
import { ClusterServiceVersionModel } from '../../models';
import type { ClusterServiceVersionKind, ProvidedAPI } from '../../types';
import { useClusterServiceVersion } from '../../utils/useClusterServiceVersion';
import ModelStatusBox from '../model-status-box';
import { DEFAULT_K8S_SCHEMA } from './const';
// eslint-disable-next-line @typescript-eslint/naming-convention
import { DEPRECATED_CreateOperandForm } from './DEPRECATED_operand-form';
import { OperandForm } from './operand-form';
import { OperandYAML } from './operand-yaml';

export const CreateOperand: FC<CreateOperandProps> = ({
  initialEditorType,
  csv,
  loaded,
  loadError,
}) => {
  const { t } = useTranslation();
  const params = useParams();
  const [model] = useK8sModel(params.plural);
  const [crd] = useK8sWatchResource<CustomResourceDefinitionKind>(
    model
      ? {
          kind: CustomResourceDefinitionModel.kind,
          isList: false,
          name: nameForModel(model),
        }
      : undefined,
  );

  const formHelpText = t(
    'olm~Create by completing the form. Default values may be provided by the Operator authors.',
  );

  const [activePerspective] = useActivePerspective();
  const [helpText, setHelpText] = useState(formHelpText);
  const next =
    activePerspective === 'dev'
      ? '/topology'
      : `${resourcePathFromModel(ClusterServiceVersionModel, params.csvName, params.ns)}/${
          params.plural
        }`;

  const providedAPI = useMemo<ProvidedAPI>(() => providedAPIForModel(csv, model), [csv, model]);

  const baseSchema = useMemo(
    () =>
      crd?.spec?.versions?.find?.((version) => version.name === providedAPI?.version)?.schema
        ?.openAPIV3Schema ?? (definitionFor(model) as JSONSchema7),
    [crd, model, providedAPI],
  );

  // TODO This logic should be removed in a later release and we should only be using the
  // OperandForm component. We are providing a temporary fallback to the old form component to ease
  // the transition to structural schemas over descriptors. Once structural schemas are required,
  // the fallback will no longer be necessary. If no structural schema is provided after this
  // fallback is fully deprecated, a form will not be generated.
  const [schema, FormComponent] = useMemo(() => {
    const useFallback =
      getSchemaErrors(baseSchema).length ||
      hasNoFields(((baseSchema as any)?.properties?.spec ?? {}) as JSONSchema7);
    return useFallback
      ? // eslint-disable-next-line @typescript-eslint/naming-convention
        [baseSchema, DEPRECATED_CreateOperandForm]
      : [
          _.defaultsDeep({}, DEFAULT_K8S_SCHEMA, _.omit(baseSchema, 'properties.status')),
          OperandForm,
        ];
  }, [baseSchema]);

  const sample = useMemo<K8sResourceKind>(() => exampleForModel(csv, model), [csv, model]);

  const pruneFunc = useCallback((data) => prune(data, sample), [sample]);

  const onChangeEditorType = useCallback(
    (newMethod) => {
      setHelpText(
        newMethod === EditorType.Form
          ? formHelpText
          : t(
              'olm~Create by manually entering YAML or JSON definitions, or by dragging and dropping a file into the editor.',
            ),
      );
    },
    [formHelpText, t],
  );

  const LAST_VIEWED_EDITOR_TYPE_USER_PREFERENCE_KEY = 'console.createOperandForm.editor.lastView';

  return (
    <StatusBox loaded={loaded} loadError={loadError} data={csv}>
      <PageHeading
        title={t('olm~Create {{item}}', { item: model.label })}
        badge={undefined}
        helpText={helpText}
      />
      <SyncedEditor
        context={{
          formContext: { csv, model, next, schema, providedAPI },
          yamlContext: { next },
        }}
        FormEditor={FormComponent}
        initialData={sample}
        initialType={initialEditorType}
        onChangeEditorType={onChangeEditorType}
        prune={pruneFunc}
        YAMLEditor={OperandYAML}
        lastViewUserPreferenceKey={LAST_VIEWED_EDITOR_TYPE_USER_PREFERENCE_KEY}
      />
    </StatusBox>
  );
};

type CreateOperandPageRouteParams = RouteParams<'csvName' | 'ns'>;

const CreateOperandPage: FC = () => {
  const { t } = useTranslation();
  const params = useParams();
  const createResourceExtension = useCreateResourceExtension(params.plural);
  const { csvName, ns } = useParams<CreateOperandPageRouteParams>();
  const [csv, loaded, loadError] = useClusterServiceVersion(csvName, ns);

  return (
    <>
      <DocumentTitle>
        {t('olm~Create {{item}}', { item: kindForReference(params.plural) })}
      </DocumentTitle>
      <ModelStatusBox groupVersionKind={params.plural}>
        {createResourceExtension ? (
          <AsyncComponent
            loader={(createResourceExtension as any).properties.component}
            namespace={params.ns}
          />
        ) : (
          <CreateOperand
            initialEditorType={EditorType.Form}
            csv={csv}
            loaded={loaded}
            loadError={loadError}
          />
        )}
      </ModelStatusBox>
    </>
  );
};

export default CreateOperandPage;

export type CreateOperandProps = {
  initialEditorType: EditorType;
  csv: ClusterServiceVersionKind;
  loaded: boolean;
  loadError: any;
};
