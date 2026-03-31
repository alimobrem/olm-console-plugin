import type { FC } from 'react';
import { useState, useMemo } from 'react';
import { Grid, GridItem } from '@patternfly/react-core';
import type { JSONSchema7 } from 'json-schema';
import * as _ from 'lodash';
import { useParams, useNavigate } from 'react-router';
import { SyncMarkdownView } from '../../../utils/markdown-shims';
import { resourcePathFromModel, useScrollToTopOnMount } from '../../../utils/utils-shims';
import type { K8sModel, K8sResourceKind } from '../../../utils/k8s-shims';
import { k8sCreate } from '../../../utils/k8s-shims';
// TODO: migrate DynamicForm - requires full DynamicForm framework (rjsf Form, custom fields, widgets, templates, styles)
import { DynamicForm } from '../../../utils/dynamic-form-shim';
import PaneBody from '../../../utils/PaneBody';
import { useResourceConnectionHandler } from '@openshift-console/dynamic-plugin-sdk';
import { ClusterServiceVersionModel } from '../../models';
import type { ClusterServiceVersionKind, CRDDescription, APIServiceDefinition } from '../../types';
import { ClusterServiceVersionLogo } from '../cluster-service-version-logo';
import { getUISchema } from './utils';

export const OperandForm: FC<OperandFormProps> = ({
  csv,
  formData,
  model,
  next,
  onChange,
  providedAPI,
  prune,
  schema,
}) => {
  const [errors, setErrors] = useState<string[]>([]);
  const params = useParams();
  const navigate = useNavigate();
  const postFormCallback = useResourceConnectionHandler();
  const processFormData = ({ metadata, ...rest }) => {
    const data = {
      metadata: {
        ...metadata,
        ...(params?.ns && model.namespaced && { namespace: params.ns }),
      },
      ...rest,
    };
    return prune?.(data) ?? data;
  };

  const handleSubmit = ({ formData: submitFormData }) => {
    k8sCreate(model, processFormData(submitFormData))
      .then((res) => postFormCallback(res))
      .then(() => next && navigate(next))
      .catch((e) => setErrors([e.message]));
  };

  const handleCancel = () => {
    if (new URLSearchParams(window.location.search).has('useInitializationResource')) {
      navigate(
        resourcePathFromModel(
          ClusterServiceVersionModel,
          csv.metadata.name,
          csv.metadata.namespace,
        ),
        { replace: true },
      );
    } else {
      navigate(-1);
    }
  };

  const uiSchema = useMemo(() => getUISchema(schema, providedAPI), [schema, providedAPI]);

  useScrollToTopOnMount();

  return (
    <PaneBody>
      <Grid hasGutter>
        <GridItem md={4} lg={5} order={{ default: '0', lg: '1' }}>
          {csv && providedAPI && (
            <div style={{ marginBottom: '30px' }}>
              <ClusterServiceVersionLogo
                displayName={providedAPI.displayName}
                icon={_.get(csv, 'spec.icon[0]')}
                provider={_.get(csv, 'spec.provider')}
              />
              <SyncMarkdownView content={providedAPI.description} />
            </div>
          )}
        </GridItem>
        <GridItem md={8} lg={7} order={{ default: '1', lg: '0' }}>
          <DynamicForm
            noValidate
            errors={errors}
            formContext={{ namespace: params.ns }}
            uiSchema={uiSchema}
            formData={formData}
            onChange={onChange}
            onError={setErrors}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            schema={schema}
          />
        </GridItem>
      </Grid>
    </PaneBody>
  );
};

type ProvidedAPI = CRDDescription | APIServiceDefinition;

export type OperandFormProps = {
  formData?: K8sResourceKind;
  onChange?: (formData?: any) => void;
  next?: string;
  csv: ClusterServiceVersionKind;
  model: K8sModel;
  providedAPI: ProvidedAPI;
  prune?: (data: any) => any;
  schema: JSONSchema7;
};
