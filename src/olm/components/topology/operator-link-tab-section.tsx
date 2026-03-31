import type { GraphElement } from '@patternfly/react-topology';
import type { DetailsTabSectionExtensionHook } from '@openshift-console/dynamic-plugin-sdk/src/extensions/topology-details';
import { ManagedByOperatorLink } from '../../../utils/misc-shims';
import { TopologySideBarTabSection, TYPE_WORKLOAD, getResource } from '../../../utils/topology-shims';

export const useManagedByOperatorLinkSideBarTabSection: DetailsTabSectionExtensionHook = (
  element: GraphElement,
) => {
  if (element.getType() !== TYPE_WORKLOAD && !element.getData()?.data?.isKnativeResource) {
    return [undefined, true, undefined];
  }
  const resource = getResource(element);
  if (!resource) {
    return [undefined, true, undefined];
  }
  const section = (
    <TopologySideBarTabSection>
      <ManagedByOperatorLink obj={resource} />
    </TopologySideBarTabSection>
  );
  return [section, true, undefined];
};
