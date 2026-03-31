/**
 * Shim for DynamicForm component.
 * The real DynamicForm from @console/shared has deep dependencies on @rjsf/core,
 * custom fields, widgets, templates, and styles. This shim re-exports a
 * placeholder that compiles standalone.
 *
 * TODO: migrate the full DynamicForm framework into this plugin or replace
 * with a local rjsf-based form implementation.
 */
import type { FC } from 'react';
import { useCallback } from 'react';
import { Accordion, ActionGroup, Button, Alert } from '@patternfly/react-core';
import type { FormProps } from '@rjsf/core';
import Form from '@rjsf/core';
import * as _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { getSchemaErrors } from './dynamic-form-utils';

const K8S_UI_SCHEMA = {
  apiVersion: { 'ui:widget': 'hidden', 'ui:options': { label: false } },
  kind: { 'ui:widget': 'hidden', 'ui:options': { label: false } },
  spec: { 'ui:options': { label: false } },
  status: { 'ui:widget': 'hidden', 'ui:options': { label: false } },
  'ui:order': ['metadata', 'spec', '*'],
};

export const DynamicForm: FC<DynamicFormProps> = ({
  errors = [],
  ErrorTemplate,
  fields = {},
  formContext,
  formData = {},
  noValidate = false,
  onChange = _.noop,
  onError = _.noop,
  onSubmit = _.noop,
  onCancel,
  schema,
  uiSchema = {},
  widgets = {},
  customUISchema,
  noActions,
  showAlert = true,
  ...restProps
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleCancel = useCallback(() => navigate(-1), [navigate]);
  const schemaErrors = getSchemaErrors(schema);

  if (schemaErrors.length) {
    // eslint-disable-next-line no-console
    console.warn('A form could not be generated for this resource.', schemaErrors);
    return (
      <Alert
        isInline
        className="co-alert co-break-word"
        variant="info"
        title={t(
          'olm~A form is not available for this resource. Please use the YAML view.',
        )}
      />
    );
  }

  return (
    <>
      {showAlert && (
        <Alert
          isInline
          className="co-alert co-break-word"
          variant="info"
          title={t(
            'olm~Note: Some fields may not be represented in this form view. Please select "YAML view" for full control.',
          )}
        />
      )}
      <Accordion asDefinitionList={false} className="co-dynamic-form__accordion">
        <Form
          {...restProps}
          className="co-dynamic-form"
          noValidate={noValidate}
          fields={fields}
          formContext={{ ...formContext, formData }}
          formData={formData}
          noHtml5Validate
          onChange={(next) => onChange(next.formData)}
          onError={(newErrors) => onError(_.map(newErrors, (error) => error.stack))}
          onSubmit={onSubmit}
          schema={schema}
          showErrorList={false}
          uiSchema={customUISchema ? uiSchema : _.defaultsDeep({}, K8S_UI_SCHEMA, uiSchema)}
          widgets={widgets}
        >
          {errors.length > 0 && ErrorTemplate && <ErrorTemplate errors={errors} />}
          {!noActions && (
            <div style={{ paddingBottom: '30px' }}>
              <ActionGroup className="pf-v6-c-form">
                <Button type="submit" variant="primary" data-test="create-dynamic-form">
                  {t('olm~Create')}
                </Button>
                <Button onClick={onCancel || handleCancel} variant="secondary">
                  {t('olm~Cancel')}
                </Button>
              </ActionGroup>
            </div>
          )}
        </Form>
      </Accordion>
    </>
  );
};

type DynamicFormProps = FormProps<any> & {
  errors?: string[];
  ErrorTemplate?: FC<{ errors: string[] }>;
  noActions?: boolean;
  customUISchema?: boolean;
  showAlert?: boolean;
  onCancel?: () => void;
};
