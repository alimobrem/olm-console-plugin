import type { FC, ReactNode } from 'react';

export const ExternalLink: FC<ExternalLinkProps> = ({
  href,
  text,
  children,
  additionalClassName = '',
  dataTestID,
}) => (
  <a
    className={`co-external-link ${additionalClassName}`}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    data-test-id={dataTestID}
  >
    {children || text}
  </a>
);

type ExternalLinkProps = {
  href: string;
  text?: string;
  children?: ReactNode;
  additionalClassName?: string;
  dataTestID?: string;
};
