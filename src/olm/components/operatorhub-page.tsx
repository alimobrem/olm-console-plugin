/**
 * OperatorHub page — displays available operators from PackageManifests
 * with operator icons, capability levels, and polished card layout.
 */
import type { FC } from 'react';
import { useState, useMemo, useCallback } from 'react';
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
  Flex,
  FlexItem,
  Gallery,
  GalleryItem,
  Label,
  PageSection,
  Pagination,
  SearchInput,
  Spinner,
  Split,
  SplitItem,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';

const PAGE_SIZE = 50;

/** Map catalog source to label color */
const sourceColor = (source: string): 'blue' | 'green' | 'orange' | 'purple' | 'grey' => {
  if (source?.includes('redhat')) return 'blue';
  if (source?.includes('certified')) return 'green';
  if (source?.includes('community')) return 'orange';
  if (source?.includes('marketplace')) return 'purple';
  return 'grey';
};

/** Extract capability level from annotations */
const getCapabilityLevel = (pkg: any): string | null => {
  const annotations = pkg?.status?.channels?.[0]?.currentCSVDesc?.annotations;
  return annotations?.capabilities || null;
};

/** Placeholder icon when no base64 icon is available */
const DefaultOperatorIcon: FC<{ name: string }> = ({ name }) => (
  <div
    style={{
      width: 40,
      height: 40,
      borderRadius: 6,
      background: 'var(--pf-t--global--background--color--secondary--default, #f0f0f0)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1rem',
      fontWeight: 700,
      color: 'var(--pf-t--global--text--color--subtle, #6a6e73)',
      flexShrink: 0,
    }}
  >
    {(name || 'O').charAt(0).toUpperCase()}
  </div>
);

const OperatorHubPage: FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

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
    const all = pkgs || [];
    if (!search.trim()) return all;
    const lc = search.toLowerCase().trim();
    return all.filter((pkg: any) => {
      const displayName = pkg.status?.channels?.[0]?.currentCSVDesc?.displayName || '';
      const name = pkg.metadata?.name || '';
      const publisher = pkg.status?.provider?.name || '';
      return (
        displayName.toLowerCase().includes(lc) ||
        name.toLowerCase().includes(lc) ||
        publisher.toLowerCase().includes(lc)
      );
    });
  }, [pkgs, search]);

  const pagedPkgs = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredPkgs.slice(start, start + PAGE_SIZE);
  }, [filteredPkgs, page]);

  const handleSearch = useCallback((_e: any, val: string) => {
    setSearch(val);
    setPage(1);
  }, []);

  const handleCardClick = useCallback((pkg: any) => {
    const name = pkg.metadata?.name || '';
    const catalog = pkg.status?.catalogSource || '';
    const catalogNamespace = pkg.status?.catalogSourceNamespace || '';
    navigate(
      `/operatorhub/subscribe?pkg=${encodeURIComponent(name)}&catalog=${encodeURIComponent(catalog)}&catalogNamespace=${encodeURIComponent(catalogNamespace)}`,
    );
  }, [navigate]);

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
                onChange={handleSearch}
                onClear={() => { setSearch(''); setPage(1); }}
                style={{ minWidth: '300px' }}
              />
            </ToolbarItem>
            <ToolbarItem variant="pagination">
              {loaded && (
                <Pagination
                  itemCount={filteredPkgs.length}
                  perPage={PAGE_SIZE}
                  page={page}
                  onSetPage={(_e, p) => setPage(p)}
                  isCompact
                />
              )}
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
        {!loaded ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Spinner size="lg" />
          </div>
        ) : filteredPkgs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--pf-t--global--text--color--subtle, #6a6e73)' }}>
            No operators match &quot;{search}&quot;
          </div>
        ) : (
          <Gallery hasGutter minWidths={{ default: '280px' }} style={{ padding: '1rem' }}>
            {pagedPkgs.map((pkg: any) => {
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
              const icon = pkg.status?.channels?.[0]?.currentCSVDesc?.icon?.[0];
              const iconSrc = icon?.base64data && icon?.mediatype
                ? `data:${icon.mediatype};base64,${icon.base64data}`
                : null;
              const capabilityLevel = getCapabilityLevel(pkg);

              return (
                <GalleryItem key={pkg.metadata?.uid || pkg.metadata?.name}>
                  <Card
                    isSelectable
                    isClickable
                    isCompact
                    style={{ cursor: 'pointer', height: '100%' }}
                  >
                    <CardHeader
                      selectableActions={{
                        onClickAction: () => handleCardClick(pkg),
                        selectableActionAriaLabel: displayName,
                      }}
                    >
                      <CardTitle style={{ width: '100%' }}>
                        <Flex
                          alignItems={{ default: 'alignItemsCenter' }}
                          gap={{ default: 'gapMd' }}
                        >
                          <FlexItem>
                            {iconSrc ? (
                              <img
                                src={iconSrc}
                                alt={displayName}
                                style={{
                                  width: 40,
                                  height: 40,
                                  objectFit: 'contain',
                                  borderRadius: 6,
                                  flexShrink: 0,
                                }}
                              />
                            ) : (
                              <DefaultOperatorIcon name={displayName} />
                            )}
                          </FlexItem>
                          <FlexItem>
                            <strong>{displayName}</strong>
                            {publisher && (
                              <div
                                style={{
                                  fontSize: '0.8rem',
                                  color: 'var(--pf-t--global--text--color--subtle, #6a6e73)',
                                }}
                              >
                                by {publisher}
                              </div>
                            )}
                          </FlexItem>
                        </Flex>
                      </CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Split hasGutter style={{ marginBottom: '0.5rem' }}>
                        <SplitItem>
                          <Label color={sourceColor(source)} isCompact>
                            {sourceDisplay}
                          </Label>
                        </SplitItem>
                        {capabilityLevel && (
                          <SplitItem>
                            <Label color="purple" isCompact variant="outline">
                              {capabilityLevel}
                            </Label>
                          </SplitItem>
                        )}
                      </Split>
                      <p
                        style={{
                          fontSize: '0.85rem',
                          color: 'var(--pf-t--global--text--color--subtle, #4f5255)',
                          lineHeight: '1.4',
                          marginTop: '0.25rem',
                        }}
                      >
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
