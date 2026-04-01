import type { FC } from 'react';
import { useMemo } from 'react';
import type { GraphElement } from '@patternfly/react-topology';
import type { DetailsTabSectionExtensionHook } from '@openshift-console/dynamic-plugin-sdk';
import { StatusBox } from '../../../../lib/console-components';

// TopologyDataObject type stub for local use
type TopologyDataObject<T = any> = any;
import { useK8sWatchResources } from '@openshift-console/dynamic-plugin-sdk';
import { referenceForModel } from '../../../../lib/k8s';
import { TYPE_OPERATOR_BACKED_SERVICE } from '../../../../lib/topology';
import { ClusterServiceVersionModel } from '../../../models';
import type { ClusterServiceVersionKind } from '../../../types';
import TopologyOperatorBackedResources from './TopologyOperatorBackedResources';
import type { OperatorGroupData } from './types';

const ResourceSection: FC<{ item: TopologyDataObject<OperatorGroupData> }> = ({ item }) => {
  const { resource, data } = item;
  const { namespace } = resource.metadata;
  const { csvName } = data;

  const resourcesList = useMemo(() => {
    return {
      csv: {
        kind: referenceForModel(ClusterServiceVersionModel),
        name: csvName,
        namespace,
        isList: false,
      },
    };
  }, [csvName, namespace]);

  const resources = useK8sWatchResources(resourcesList);

  return (
    <StatusBox
      data={resources.csv.data}
      loaded={resources.csv.loaded}
      loadError={resources.csv.loadError}
      label="Operator Resources"
    >
      <TopologyOperatorBackedResources
        item={item}
        csv={resources.csv.data as ClusterServiceVersionKind}
      />
    </StatusBox>
  );
};

export const useOperatorBackedPanelResourceSection: DetailsTabSectionExtensionHook = (
  element: GraphElement,
) => {
  if (element.getType() !== TYPE_OPERATOR_BACKED_SERVICE) {
    return [undefined, true, undefined];
  }
  const section = <ResourceSection item={element.getData()} />;
  return [section, true, undefined];
};
