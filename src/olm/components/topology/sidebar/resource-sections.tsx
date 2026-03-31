import type { FC } from 'react';
import { useMemo } from 'react';
import type { GraphElement } from '@patternfly/react-topology';
import type { DetailsTabSectionExtensionHook } from '@openshift-console/dynamic-plugin-sdk/src/extensions/topology-details';
import type { TopologyDataObject } from '@openshift-console/dynamic-plugin-sdk/src/extensions/topology-types';
import { StatusBox } from '../../../../utils/utils-shims';
import { useK8sWatchResources } from '@openshift-console/dynamic-plugin-sdk';
import { referenceForModel } from '../../utils/k8s-shims';
import { TYPE_OPERATOR_BACKED_SERVICE } from '../../../../utils/topology-shims';
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
