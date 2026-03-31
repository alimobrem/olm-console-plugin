import type { FC } from 'react';
import type { JSONSchema7 } from 'json-schema';
import * as _ from 'lodash';
import { Conditions } from '../../utils/Conditions';
import { SectionHeading } from '../../../../utils/utils-shims';
import type { K8sResourceKind } from '@openshift-console/dynamic-plugin-sdk/src/extensions/console-types';
import PaneBody from '../../../../utils/PaneBody';
import type { StatusDescriptor } from '../types';
import { DescriptorType } from '../types';
import { useCalculatedDescriptorProperties } from '../utils';

// Determines if the descriptor points to an array value.
const validateConditionsDescriptor = (descriptor: StatusDescriptor, value: any): boolean => {
  if (!_.isArray(value)) {
    // eslint-disable-next-line no-console
    console.warn(
      `[Invalid x-descriptor] 'urn:alm:descriptor:io.kubernetes.conditions' is incompatible with ${descriptor.path} and will have no effect`,
      descriptor,
    );
    return false;
  }
  return true;
};

export const DescriptorConditions: FC<ConditionsDescriptorProps> = ({
  descriptor,
  obj,
  schema,
}) => {
  const { displayName, value } = useCalculatedDescriptorProperties(
    DescriptorType.status,
    descriptor,
    schema,
    obj,
  );

  if (!validateConditionsDescriptor(descriptor, value)) {
    return null;
  }

  return (
    <PaneBody>
      <SectionHeading text={displayName} />
      <Conditions conditions={value} />
    </PaneBody>
  );
};
DescriptorConditions.displayName = 'DescriptorConditions';

type ConditionsDescriptorProps = {
  descriptor: StatusDescriptor;
  obj: K8sResourceKind;
  schema: JSONSchema7;
};
