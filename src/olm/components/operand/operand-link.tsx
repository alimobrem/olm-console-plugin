import type { FC } from 'react';
import { css } from '@patternfly/react-styles';
import { Link } from 'react-router';
import { ResourceIcon } from '../../../utils/utils-shims';
import type { K8sResourceKind } from '@openshift-console/dynamic-plugin-sdk/src/extensions/console-types';
import { referenceForModel, referenceFor } from '../../../utils/k8s-shims';
import { ClusterServiceVersionModel } from '../../models';

export const csvNameFromWindow = () =>
  window.location.pathname
    .split('/')
    .find(
      (part, i, allParts) =>
        allParts[i - 1] === referenceForModel(ClusterServiceVersionModel) ||
        allParts[i - 1] === ClusterServiceVersionModel.plural,
    );

export const OperandLink: FC<OperandLinkProps> = (props) => {
  const { namespace, name } = props.obj.metadata;
  const csvName = props.csvName || csvNameFromWindow();

  const reference = referenceFor(props.obj);
  const to = namespace
    ? `/k8s/ns/${namespace}/${ClusterServiceVersionModel.plural}/${csvName}/${reference}/${name}`
    : `/k8s/cluster/${reference}/${name}`;
  const classes = css('co-resource-item', {
    'co-resource-item--inline': props.inline,
  });

  return (
    <span className={classes}>
      <ResourceIcon kind={referenceFor(props.obj)} />
      <Link
        to={to}
        className="co-resource-item__resource-name"
        onClick={props.onClick}
        data-test-operand-link={name}
        data-test={name}
      >
        {name}
      </Link>
    </span>
  );
};

export type OperandLinkProps = {
  obj: K8sResourceKind;
  csvName?: string;
  onClick?: () => void;
  inline?: boolean;
};

OperandLink.displayName = 'OperandLink';
