/**
 * Shims for @console/topology imports.
 *
 * Constants and lightweight components that were previously imported
 * from the @console/topology package.
 */
import type { FC, ReactElement, ReactNode } from 'react';
import type { GraphElement } from '@patternfly/react-topology';
import { SectionHeading as SidebarSectionHeading } from './console-components';
import type { K8sResourceKind } from '@openshift-console/dynamic-plugin-sdk';
import { modelFor, referenceFor } from './k8s';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Node type for generic workloads in the topology view. */
export const TYPE_WORKLOAD = 'workload';

/** Node type for operator-backed services in the topology view. */
export const TYPE_OPERATOR_BACKED_SERVICE = 'operator-backed-service';

// ---------------------------------------------------------------------------
// getResource – from @console/topology/src/utils/topology-utils
// ---------------------------------------------------------------------------

const getTopologyResourceObject = (topologyObject: any): K8sResourceKind | null => {
  if (!topologyObject) {
    return null;
  }
  return topologyObject.resource || topologyObject.resources?.obj;
};

/**
 * Extracts the K8s resource from a topology GraphElement.
 */
export const getResource = <T = K8sResourceKind>(node: GraphElement): T | null => {
  // OdcBaseNode exposes getResource(); fall back to data-based lookup
  const resource = (node as any)?.getResource?.();
  return (resource as T) || (getTopologyResourceObject(node?.getData()) as T);
};

// ---------------------------------------------------------------------------
// TopologySideBarTabSection – from @console/topology/src/components/side-bar
// ---------------------------------------------------------------------------

interface TopologySideBarTabSectionProps {
  children?: ReactNode;
}

/**
 * Simple wrapper that renders children inside a topology sidebar tab section.
 */
export const TopologySideBarTabSection: FC<TopologySideBarTabSectionProps> = ({ children }) => {
  return <div className="ocs-sidebar-tabsection">{children}</div>;
};

// ---------------------------------------------------------------------------
// TopologyGroupResourceList – minimal inline version
// ---------------------------------------------------------------------------

type TopologyGroupResourceListProps = {
  resources: K8sResourceKind[];
  releaseNamespace: string;
  linkForResource?: (obj: K8sResourceKind) => ReactElement;
};

const TopologyGroupResourceList: FC<TopologyGroupResourceListProps> = ({
  resources,
  releaseNamespace,
  linkForResource,
}) => {
  return (
    <ul className="list-group">
      {resources.map((resource) => (
        <li className="list-group-item" key={resource.metadata?.uid || resource.metadata?.name}>
          {linkForResource ? linkForResource(resource) : resource.metadata?.name}
        </li>
      ))}
    </ul>
  );
};

// ---------------------------------------------------------------------------
// TopologyGroupResourcesPanel – from @console/topology/src/components/side-bar
// ---------------------------------------------------------------------------

type TopologyGroupResourcesPanelProps = {
  manifestResources: K8sResourceKind[];
  releaseNamespace: string;
  linkForResource?: (obj: K8sResourceKind) => ReactElement;
};

export const TopologyGroupResourcesPanel: FC<TopologyGroupResourcesPanelProps> = ({
  manifestResources,
  releaseNamespace,
  linkForResource,
}) => {
  const kinds = manifestResources
    .reduce((resourceKinds: string[], resource) => {
      const kind = referenceFor(resource);
      if (!resourceKinds.includes(kind)) {
        resourceKinds.push(kind);
      }
      return resourceKinds;
    }, [])
    .sort((a, b) => a.localeCompare(b));

  return kinds.reduce((lists: ReactElement[], kind) => {
    const model = modelFor(kind);
    const resources = manifestResources.filter((resource) => resource.kind === model?.kind);
    if (resources.length && model) {
      lists.push(
        <div key={model.kind}>
          <SidebarSectionHeading text={model.labelPlural} />
          <TopologyGroupResourceList
            resources={resources}
            releaseNamespace={releaseNamespace}
            linkForResource={linkForResource}
          />
        </div>,
      );
    }
    return lists;
  }, []);
};
