/**
 * Stub field components for the RJSF dynamic form framework.
 * Migrated from @console/shared/src/components/dynamic-form/fields.
 *
 * These are placeholder implementations that render simple inputs.
 * The real implementations provide rich UIs for node affinity, pod affinity,
 * resource requirements, and update strategy editing.
 *
 * TODO: Implement full field components with proper Kubernetes-aware UIs,
 * or re-export from @rjsf/core if suitable generic alternatives exist.
 */

import type { FC } from 'react';
import type { FieldProps } from '@rjsf/core';

/**
 * NodeAffinityField - renders a form field for editing node affinity rules.
 * Stub: renders the default RJSF field behavior via JSON textarea.
 */
export const NodeAffinityField: FC<FieldProps> = (props) => {
  const { formData, onChange, name } = props;
  return (
    <div className="co-dynamic-form__field">
      <label htmlFor={`${name}-node-affinity`}>{props.schema?.title || 'Node Affinity'}</label>
      <textarea
        id={`${name}-node-affinity`}
        className="pf-v6-c-form-control"
        value={typeof formData === 'object' ? JSON.stringify(formData, null, 2) : (formData ?? '')}
        onChange={(e) => {
          try {
            onChange(JSON.parse(e.target.value));
          } catch {
            // allow intermediate invalid JSON while typing
          }
        }}
        rows={6}
      />
    </div>
  );
};
NodeAffinityField.displayName = 'NodeAffinityField';

/**
 * PodAffinityField - renders a form field for editing pod affinity / anti-affinity rules.
 * Stub: renders JSON textarea.
 */
export const PodAffinityField: FC<FieldProps> = (props) => {
  const { formData, onChange, name } = props;
  return (
    <div className="co-dynamic-form__field">
      <label htmlFor={`${name}-pod-affinity`}>{props.schema?.title || 'Pod Affinity'}</label>
      <textarea
        id={`${name}-pod-affinity`}
        className="pf-v6-c-form-control"
        value={typeof formData === 'object' ? JSON.stringify(formData, null, 2) : (formData ?? '')}
        onChange={(e) => {
          try {
            onChange(JSON.parse(e.target.value));
          } catch {
            // allow intermediate invalid JSON while typing
          }
        }}
        rows={6}
      />
    </div>
  );
};
PodAffinityField.displayName = 'PodAffinityField';

/**
 * ResourceRequirementsField - renders a form field for editing resource requests/limits.
 * Stub: renders JSON textarea.
 */
export const ResourceRequirementsField: FC<FieldProps> = (props) => {
  const { formData, onChange, name } = props;
  return (
    <div className="co-dynamic-form__field">
      <label htmlFor={`${name}-resource-requirements`}>
        {props.schema?.title || 'Resource Requirements'}
      </label>
      <textarea
        id={`${name}-resource-requirements`}
        className="pf-v6-c-form-control"
        value={typeof formData === 'object' ? JSON.stringify(formData, null, 2) : (formData ?? '')}
        onChange={(e) => {
          try {
            onChange(JSON.parse(e.target.value));
          } catch {
            // allow intermediate invalid JSON while typing
          }
        }}
        rows={6}
      />
    </div>
  );
};
ResourceRequirementsField.displayName = 'ResourceRequirementsField';

/**
 * UpdateStrategyField - renders a form field for editing deployment update strategy.
 * Stub: renders JSON textarea.
 */
export const UpdateStrategyField: FC<FieldProps> = (props) => {
  const { formData, onChange, name } = props;
  return (
    <div className="co-dynamic-form__field">
      <label htmlFor={`${name}-update-strategy`}>
        {props.schema?.title || 'Update Strategy'}
      </label>
      <textarea
        id={`${name}-update-strategy`}
        className="pf-v6-c-form-control"
        value={typeof formData === 'object' ? JSON.stringify(formData, null, 2) : (formData ?? '')}
        onChange={(e) => {
          try {
            onChange(JSON.parse(e.target.value));
          } catch {
            // allow intermediate invalid JSON while typing
          }
        }}
        rows={6}
      />
    </div>
  );
};
UpdateStrategyField.displayName = 'UpdateStrategyField';
