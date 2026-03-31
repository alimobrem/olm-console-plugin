/**
 * Stub widget components for the RJSF dynamic form framework.
 * Migrated from @console/shared/src/components/dynamic-form/widgets.
 *
 * These are simple implementations that provide basic form controls.
 * The real implementations have additional validation, styling, and
 * Kubernetes-specific logic.
 *
 * TODO: Enhance with full Kubernetes-aware widget implementations if needed.
 */

import type { FC } from 'react';
import type { WidgetProps } from '@rjsf/core';
import { Checkbox, NumberInput, Switch, TextInput } from '@patternfly/react-core';

/**
 * TextWidget - renders a text input.
 */
export const TextWidget: FC<WidgetProps> = ({ id, value, onChange, disabled, readonly, label }) => (
  <TextInput
    id={id}
    value={value ?? ''}
    onChange={(_event, val) => onChange(val)}
    isDisabled={disabled || readonly}
    aria-label={label || id}
  />
);
TextWidget.displayName = 'TextWidget';

/**
 * NumberWidget - renders a number input.
 */
export const NumberWidget: FC<WidgetProps> = ({ id, value, onChange, disabled, readonly, label }) => (
  <NumberInput
    id={id}
    value={value ?? 0}
    onChange={(event) => onChange(Number((event.target as HTMLInputElement).value))}
    onMinus={() => onChange((value ?? 0) - 1)}
    onPlus={() => onChange((value ?? 0) + 1)}
    isDisabled={disabled || readonly}
    aria-label={label || id}
  />
);
NumberWidget.displayName = 'NumberWidget';

/**
 * PasswordWidget - renders a password input.
 */
export const PasswordWidget: FC<WidgetProps> = ({
  id,
  value,
  onChange,
  disabled,
  readonly,
  label,
}) => (
  <TextInput
    id={id}
    type="password"
    value={value ?? ''}
    onChange={(_event, val) => onChange(val)}
    isDisabled={disabled || readonly}
    aria-label={label || id}
  />
);
PasswordWidget.displayName = 'PasswordWidget';

/**
 * CheckboxWidget - renders a checkbox.
 */
export const CheckboxWidget: FC<WidgetProps> = ({
  id,
  value,
  onChange,
  disabled,
  readonly,
  label,
}) => (
  <Checkbox
    id={id}
    isChecked={!!value}
    onChange={(_event, checked) => onChange(checked)}
    isDisabled={disabled || readonly}
    label={label || id}
  />
);
CheckboxWidget.displayName = 'CheckboxWidget';

/**
 * SwitchWidget - renders a toggle switch (boolean).
 */
export const SwitchWidget: FC<WidgetProps> = ({
  id,
  value,
  onChange,
  disabled,
  readonly,
  label,
}) => (
  <Switch
    id={id}
    isChecked={!!value}
    onChange={(_event, checked) => onChange(checked)}
    isDisabled={disabled || readonly}
    label={label || id}
  />
);
SwitchWidget.displayName = 'SwitchWidget';

/**
 * ImagePullPolicyWidget - renders a select for Kubernetes image pull policies.
 */
export const ImagePullPolicyWidget: FC<WidgetProps> = ({
  id,
  value,
  onChange,
  disabled,
  readonly,
}) => (
  <select
    id={id}
    className="pf-v6-c-form-control"
    value={value ?? 'IfNotPresent'}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled || readonly}
  >
    <option value="Always">Always</option>
    <option value="IfNotPresent">IfNotPresent</option>
    <option value="Never">Never</option>
  </select>
);
ImagePullPolicyWidget.displayName = 'ImagePullPolicyWidget';

/**
 * PodCountWidget - renders a number input for pod count / replicas.
 */
export const PodCountWidget: FC<WidgetProps> = ({
  id,
  value,
  onChange,
  disabled,
  readonly,
  label,
}) => (
  <NumberInput
    id={id}
    value={value ?? 1}
    min={0}
    onChange={(event) => onChange(Number((event.target as HTMLInputElement).value))}
    onMinus={() => onChange(Math.max(0, (value ?? 1) - 1))}
    onPlus={() => onChange((value ?? 1) + 1)}
    isDisabled={disabled || readonly}
    aria-label={label || 'Pod count'}
  />
);
PodCountWidget.displayName = 'PodCountWidget';

/**
 * SelectWidget - renders a select dropdown from enum values.
 */
export const SelectWidget: FC<WidgetProps> = ({
  id,
  value,
  onChange,
  disabled,
  readonly,
  options,
  schema,
}) => {
  const enumOptions = (options as any)?.enumOptions ?? schema?.enum?.map((v: string) => ({ value: v, label: v })) ?? [];
  return (
    <select
      id={id}
      className="pf-v6-c-form-control"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled || readonly}
    >
      <option value="">-- Select --</option>
      {enumOptions.map((opt: { value: string; label: string }) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};
SelectWidget.displayName = 'SelectWidget';
