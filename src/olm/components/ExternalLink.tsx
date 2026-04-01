import type { FC, ReactNode } from 'react';

export const ExternalLink: FC<ExternalLinkProps> = ({
  href,
  text,
  children,
  additionalClassName = '',
  className,
  dataTestID,
}) => (
  <a
    className={`co-external-link ${className || additionalClassName}`}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    data-test-id={dataTestID}
  >
    {children || text}
  </a>
);

export type ExternalLinkProps = {
  href: string;
  text?: string;
  children?: ReactNode;
  additionalClassName?: string;
  className?: string;
  dataTestID?: string;
};
