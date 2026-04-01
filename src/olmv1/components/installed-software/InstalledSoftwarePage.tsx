import type { FC, ReactNode, ComponentType } from 'react';
import { useMemo, useState } from 'react';
import { Flex, PageSection, Title, Tab, Tabs } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { NamespaceBar } from '../../../lib/legacy-components';
import { AsyncComponent } from '../../../lib/console-components';
import type { Page } from '../../../lib/factory';

/* ---- Inlined MultiTabListPage ---- */
interface MultiTabListPagePage {
  href: string;
  name?: string;
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

const MultiTabListPage: FC<MultiTabListPageProps> = ({ title, badge, pages }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <PageSection variant="default">
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
import ClusterExtensionListPage from '../cluster-extension/ClusterExtensionListPage';
import { OLMv1TechPreviewBadge } from '../OLMv1TechPreviewBadge';

const InstalledSoftwarePage: FC = () => {
  const { t } = useTranslation();
  const { ns } = useParams<{ ns?: string }>();

  const clusterExtensionsPage = useMemo<Page>(
    () => ({
      href: '',
      name: t('olm-v1~Cluster extensions (OLMv1)'),
      badge: [
        <Flex key="olmv1-tech-preview-badge" alignItems={{ default: 'alignItemsCenter' }}>
          <OLMv1TechPreviewBadge />
        </Flex>,
      ],
      component: () => <ClusterExtensionListPage />,
    }),
    [t],
  );

  const clusterServiceVersionsPage = useMemo<Page>(
    () => ({
      href: 'olmv0-operators',
      name: t('olm-v1~Operators (OLMv0)'),
      component: () => (
        <AsyncComponent
          loader={() =>
            import('../../../olm/components/clusterserviceversion').then(
              (m) => m.ClusterServiceVersionsPage,
            )
          }
          namespace={ns}
          showTitle={false}
        />
      ),
    }),
    [ns, t],
  );

  const pages = useMemo<Page[]>(() => [clusterExtensionsPage, clusterServiceVersionsPage], [
    clusterExtensionsPage,
    clusterServiceVersionsPage,
  ]);

  return (
    <>
      <NamespaceBar />
      <MultiTabListPage title={t('olm-v1~Installed Software')} pages={pages} />
    </>
  );
};

export default InstalledSoftwarePage;
