/**
 * Shims for CatalogPageOverlay and CatalogPageOverlayDescription.
 * Migrated from @console/shared/src/components/catalog/catalog-view/.
 *
 * CatalogPageOverlay is a full-page overlay panel for catalog item details.
 * CatalogPageOverlayDescription is a description section inside the overlay.
 *
 * TODO: Replace with a full PatternFly Drawer-based implementation if
 * richer behavior (slide-in animation, backdrop, etc.) is needed.
 */

import type { FC, ReactNode } from 'react';

interface CatalogPageOverlayProps {
  children?: ReactNode;
}

/**
 * A layout wrapper that renders the catalog item detail overlay content.
 * The original component provides a two-pane layout (side panel + description).
 * This shim renders children in a flex container to preserve the layout.
 */
const CatalogPageOverlay: FC<CatalogPageOverlayProps> = ({ children }) => {
  return (
    <div className="co-catalog-page__overlay-body" style={{ display: 'flex' }}>
      {children}
    </div>
  );
};
CatalogPageOverlay.displayName = 'CatalogPageOverlay';

export default CatalogPageOverlay;

interface CatalogPageOverlayDescriptionProps {
  children?: ReactNode;
}

/**
 * Wrapper for the description/content area inside the catalog overlay.
 * Renders children in a scrollable container.
 */
export const CatalogPageOverlayDescription: FC<CatalogPageOverlayDescriptionProps> = ({
  children,
}) => {
  return (
    <div className="co-catalog-page__overlay-description" style={{ flex: 1, overflow: 'auto' }}>
      {children}
    </div>
  );
};
CatalogPageOverlayDescription.displayName = 'CatalogPageOverlayDescription';
