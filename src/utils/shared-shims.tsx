/**
 * Shims for @console/shared imports that do not yet have SDK equivalents.
 *
 * Each export here is intentionally thin and will be replaced once a proper
 * SDK-based alternative or local implementation is available.
 */

import type { FC, ReactNode, ComponentType } from 'react';
import { useState } from 'react';
import { PageSection, Title, Tab, Tabs } from '@patternfly/react-core';

/* ------------------------------------------------------------------ */
/*  MultiTabListPage                                                   */
/*  from @console/shared → multi-tab-list/MultiTabListPage             */
/*  TODO: rewrite with SDK HorizontalNav or PatternFly Tabs            */
/* ------------------------------------------------------------------ */

export interface MultiTabListPagePage {
  href: string;
  name: string;
  component?: ComponentType<any> | (() => ReactNode);
  badge?: ReactNode;
  [key: string]: any;
}

interface MultiTabListPageProps {
  title: string;
  badge?: ReactNode;
  pages: MultiTabListPagePage[];
  [key: string]: any;
}

export const MultiTabListPage: FC<MultiTabListPageProps> = ({ title, badge, pages }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <PageSection variant="light">
        <Title headingLevel="h1" size="2xl">
          {title} {badge}
        </Title>
      </PageSection>
      <Tabs
        activeKey={activeTab}
        onSelect={(_e, key) => setActiveTab(key as number)}
        className="co-m-horizontal-nav__menu"
      >
        {pages.map((page, idx) => {
          const PageComponent = page.component;
          return (
            <Tab
              key={page.href || idx}
              eventKey={idx}
              title={
                <span>
                  {page.name} {page.badge}
                </span>
              }
            >
              {activeTab === idx && PageComponent && <PageComponent />}
            </Tab>
          );
        })}
      </Tabs>
    </>
  );
};
