import type { FC } from 'react';
import { DescriptionList, Grid, GridItem } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { useOverlay } from '../../../lib/modals';
import type { DetailsPageProps } from '../../../lib/factory';
import { DetailsPage } from '../../../lib/factory';
import {
  navFactory,
  SectionHeading,
  ResourceSummary,
  DetailsItem,
  useAccessReview,
} from '../../../lib/console-components';
import PaneBody from '../PaneBody';
import { OperatorHubModel } from '../../models';
import type { CatalogSourceListPageProps } from '../catalog-source';
import { CatalogSourceListPage } from '../catalog-source';
import { LazyEditDefaultSourcesModalOverlay } from '../modals';
import type { OperatorHubKind } from '.';

const OperatorHubDetails: FC<OperatorHubDetailsProps> = ({ obj: operatorHub }) => {
  const { t } = useTranslation();
  const launchModal = useOverlay();

  const canEditDefaultSources = useAccessReview({
    group: OperatorHubModel.apiGroup,
    resource: OperatorHubModel.plural,
    verb: 'patch',
  });

  return (
    <PaneBody>
      <SectionHeading text={t('olm~OperatorHub details')} />
      <Grid hasGutter>
        <GridItem sm={6}>
          <ResourceSummary
            resource={operatorHub}
            podSelector="spec.podSelector"
            showNodeSelector={false}
          />
        </GridItem>
        <GridItem sm={6}>
          <DescriptionList>
            <DetailsItem
              label={t('olm~Default sources')}
              obj={operatorHub}
              path="status.sources"
              canEdit={canEditDefaultSources}
              onEdit={() => launchModal(LazyEditDefaultSourcesModalOverlay, { operatorHub })}
              editAsGroup
              hideEmpty
            >
              {operatorHub?.status?.sources
                .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
                .map((source, idx) => {
                  return (
                    <DescriptionList key={source.name}>
                      <DetailsItem
                        label={source.name}
                        obj={operatorHub}
                        path={`status.sources[${idx}]`}
                      >
                        <p data-test={`status_${source.name}`}>
                          {source.disabled ? t('public~Disabled') : t('public~Enabled')}
                        </p>
                      </DetailsItem>
                    </DescriptionList>
                  );
                })}
            </DetailsItem>
          </DescriptionList>
        </GridItem>
      </Grid>
    </PaneBody>
  );
};

const Sources: FC<CatalogSourceListPageProps> = (props) => (
  <CatalogSourceListPage showTitle={false} {...props} />
);

export const OperatorHubDetailsPage: FC<DetailsPageProps> = (props) => {
  const pages = [
    navFactory.details(OperatorHubDetails),
    navFactory.editYaml(),
    {
      href: 'sources',
      // t('olm~Sources')
      nameKey: 'olm~Sources',
      component: Sources,
    },
  ];
  return <DetailsPage {...props} pages={pages} />;
};

type OperatorHubDetailsProps = {
  obj: OperatorHubKind;
};
