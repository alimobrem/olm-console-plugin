import type { GraphElement } from '@patternfly/react-topology';
import { ManagedByOperatorResourceLink } from '../../../../lib/legacy-components';
import { TYPE_OPERATOR_BACKED_SERVICE } from '../../../../lib/topology';

export const getOperatorBackedPanelResourceLink = (element: GraphElement) => {
  if (element.getType() !== TYPE_OPERATOR_BACKED_SERVICE) return undefined;
  const item = element.getData();
  const { name, resource, data } = item;
  const { csvName } = data;
  return (
    <ManagedByOperatorResourceLink
      csvName={csvName}
      namespace={resource.metadata.namespace}
      owner={{
        name,
        kind: resource.kind,
        uid: resource.metadata.uid,
        apiVersion: resource.apiVersion,
      }}
    />
  );
};
