/**
 * Minimal OperatorHub page using SDK components directly.
 * Displays PackageManifests in a card grid layout.
 */
import type { FC } from 'react';
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
  CardTitle,
  Gallery,
  GalleryItem,
  Spinner,
  PageSection,
  Title,
} from '@patternfly/react-core';

const OperatorHubPage: FC = () => {
  const navigate = useNavigate();

  const [pkgs, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>({
    groupVersionKind: {
      group: 'packages.operators.coreos.com',
      version: 'v1',
      kind: 'PackageManifest',
    },
    isList: true,
    namespaced: false,
  });

  const handleCardClick = (pkg: any) => {
    const name = pkg.metadata?.name || '';
    const catalog = pkg.status?.catalogSource || '';
    const catalogNamespace = pkg.status?.catalogSourceNamespace || '';
    navigate(
      `/operatorhub/subscribe?pkg=${encodeURIComponent(name)}&catalog=${encodeURIComponent(catalog)}&catalogNamespace=${encodeURIComponent(catalogNamespace)}`,
    );
  };

  if (loadError) {
    return (
      <PageSection>
        <p>
          Error loading PackageManifests:{' '}
          {loadError.message || String(loadError)}
        </p>
      </PageSection>
    );
  }

  return (
    <>
      <ListPageHeader title="OperatorHub" />
      <ListPageBody>
        {!loaded ? (
          <Spinner size="lg" />
        ) : (
          <Gallery hasGutter minWidths={{ default: '260px' }}>
            {(pkgs || []).map((pkg: any) => {
              const displayName =
                pkg.status?.channels?.[0]?.currentCSVDesc?.displayName ||
                pkg.metadata?.name ||
                '-';
              const publisher =
                pkg.status?.provider?.name ||
                pkg.status?.channels?.[0]?.currentCSVDesc?.provider?.name ||
                '-';
              const description =
                pkg.status?.channels?.[0]?.currentCSVDesc?.description || '';
              return (
                <GalleryItem key={pkg.metadata?.uid || pkg.metadata?.name}>
                  <Card
                    isSelectable
                    isClickable
                    onClick={() => handleCardClick(pkg)}
                    style={{ cursor: 'pointer' }}
                  >
                    <CardTitle>{displayName}</CardTitle>
                    <CardBody>
                      <p>
                        <strong>Publisher:</strong> {publisher}
                      </p>
                      <p style={{ marginTop: '0.5rem' }}>
                        {description
                          ? description.length > 150
                            ? `${description.slice(0, 150)}...`
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

/** Placeholder subscribe page */
export const OperatorHubSubscribePage: FC = () => (
  <PageSection>
    <Title headingLevel="h1">Subscribe</Title>
    <p>Subscribe form will be displayed here.</p>
  </PageSection>
);

/** Placeholder details page */
export const OperatorHubDetailsPage: FC = () => (
  <PageSection>
    <Title headingLevel="h1">OperatorHub Details</Title>
    <p>Operator details will be displayed here.</p>
  </PageSection>
);
