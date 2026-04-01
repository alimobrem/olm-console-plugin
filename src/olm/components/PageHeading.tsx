import type { FC, ReactNode } from 'react';
import {
  PageSection,
  Title,
  Breadcrumb,
  BreadcrumbItem,
} from '@patternfly/react-core';
import { Link } from 'react-router-dom';

export const PageHeading: FC<PageHeadingProps> = ({
  title,
  helpText,
  breadcrumbs,
  children,
}) => (
  <PageSection variant="default">
    {breadcrumbs?.length > 0 && (
      <Breadcrumb className="co-breadcrumb">
        {breadcrumbs.map((crumb, i) => (
          <BreadcrumbItem key={crumb.name} isActive={i === breadcrumbs.length - 1}>
            {i < breadcrumbs.length - 1 ? (
              <Link to={crumb.path}>{crumb.name}</Link>
            ) : (
              crumb.name
            )}
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    )}
    <Title headingLevel="h1" size="2xl">
      {title}
    </Title>
    {helpText && <p className="help-block co-m-pane__heading-help-text">{helpText}</p>}
    {children}
  </PageSection>
);

type PageHeadingProps = {
  title: string | ReactNode;
  helpText?: string | ReactNode;
  breadcrumbs?: { name: string; path: string }[];
  badge?: ReactNode;
  children?: ReactNode;
};
