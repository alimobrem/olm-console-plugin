/**
 * OperatorHub page — displays available operators from PackageManifests.
 */
import type { FC } from 'react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  useK8sWatchResource,
  ListPageHeader,
  ListPageBody,
} from '@openshift-console/dynamic-plugin-sdk';
import type { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Gallery,
  GalleryItem,
  Label,
  PageSection,
  SearchInput,
  Spinner,
  Split,
  SplitItem,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';

const OperatorHubPage: FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const [pkgs, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>({
    groupVersionKind: {
      group: 'packages.operators.coreos.com',
      version: 'v1',
      kind: 'PackageManifest',
    },
    isList: true,
    namespace: 'openshift-marketplace',
  });

  const filteredPkgs = useMemo(() => {
    if (!search) return pkgs || [];
    const lc = search.toLowerCase();
    return (pkgs || []).filter((pkg: any) => {
      const name = pkg.status?.channels?.[0]?.currentCSVDesc?.displayName || pkg.metadata?.name || '';
      const publisher = pkg.status?.provider?.name || '';
      return name.toLowerCase().includes(lc) || publisher.toLowerCase().includes(lc);
    });
  }, [pkgs, search]);

  const handleCardClick = (pkg: any) => {
    const name = pkg.metadata?.name || '';
    const catalog = pkg.status?.catalogSource || '';
    const catalogNamespace = pkg.status?.catalogSourceNamespace || '';
    navigate(
      `/operatorhub/subscribe?pkg=${encodeURIComponent(name)}&catalog=${encodeURIComponent(catalog)}&catalogNamespace=${encodeURIComponent(catalogNamespace)}`,
    );
  };

  const sourceColor = (source: string): 'blue' | 'green' | 'orange' | 'purple' | 'grey' => {
    if (source?.includes('redhat')) return 'blue';
    if (source?.includes('certified')) return 'green';
    if (source?.includes('community')) return 'orange';
    if (source?.includes('marketplace')) return 'purple';
    return 'grey';
  };

  if (loadError) {
    return (
      <PageSection>
        <Title headingLevel="h1">OperatorHub</Title>
        <p>Error loading operators: {loadError.message || String(loadError)}</p>
      </PageSection>
    );
  }

  return (
    <>
      <ListPageHeader title="OperatorHub" />
      <ListPageBody>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>
              <SearchInput
                placeholder="Filter by name or provider..."
                value={search}
                onChange={(_e, val) => setSearch(val)}
                onClear={() => setSearch('')}
                style={{ minWidth: '300px' }}
              />
            </ToolbarItem>
            <ToolbarItem>
              {loaded && <span>{filteredPkgs.length} items</span>}
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
        {!loaded ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Spinner size="lg" />
          </div>
        ) : (
          <Gallery hasGutter minWidths={{ default: '280px' }} style={{ padding: '1rem' }}>
            {filteredPkgs.map((pkg: any) => {
              const displayName =
                pkg.status?.channels?.[0]?.currentCSVDesc?.displayName ||
                pkg.metadata?.name || '-';
              const publisher =
                pkg.status?.provider?.name ||
                pkg.status?.channels?.[0]?.currentCSVDesc?.provider?.name || '';
              const description =
                pkg.status?.channels?.[0]?.currentCSVDesc?.description || '';
              const source = pkg.status?.catalogSource || '';
              const sourceDisplay = pkg.status?.catalogSourceDisplayName || source;

              return (
                <GalleryItem key={pkg.metadata?.uid || pkg.metadata?.name}>
                  <Card
                    isSelectable
                    isClickable
                    isCompact
                    onClick={() => handleCardClick(pkg)}
                    style={{ cursor: 'pointer', height: '100%' }}
                  >
                    <CardHeader>
                      <CardTitle>
                        <Split hasGutter>
                          <SplitItem isFilled>
                            <strong>{displayName}</strong>
                          </SplitItem>
                        </Split>
                      </CardTitle>
                    </CardHeader>
                    <CardBody>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <Label color={sourceColor(source)} isCompact>
                          {sourceDisplay}
                        </Label>
                        {publisher && (
                          <span style={{ marginLeft: '0.5rem', color: '#6a6e73', fontSize: '0.85rem' }}>
                            {publisher}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#4f5255', lineHeight: '1.4' }}>
                        {description
                          ? description.length > 120
                            ? `${description.slice(0, 120)}...`
                            : description
                          : 'No description available.'}
                      </p>
                    </CardBody>
                  </Card>
                </GalleryItem>
              );
            })}
          </Gallery>
        )}
      </ListPageBody>
    </>
  );
};

export default OperatorHubPage;

export const OperatorHubSubscribePage: FC = () => (
  <PageSection>
    <Title headingLevel="h1">Subscribe to Operator</Title>
    <p>The operator subscription form will be available here.</p>
  </PageSection>
);

export const OperatorHubDetailsPage: FC = () => (
  <PageSection>
    <Title headingLevel="h1">OperatorHub Details</Title>
    <p>Operator details will be displayed here.</p>
  </PageSection>
);
