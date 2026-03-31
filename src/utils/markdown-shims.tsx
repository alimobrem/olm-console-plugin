/**
 * Shim for @console/internal/components/markdown-view.
 *
 * Provides a minimal markdown renderer using dangerouslySetInnerHTML
 * as a placeholder until a proper markdown library is integrated.
 */

import type { FC } from 'react';

export type SyncMarkdownViewProps = {
  content?: string;
  styles?: string;
  exactHeight?: boolean;
  truncateContent?: boolean;
  inline?: boolean;
  renderExtension?: (contentDocument: HTMLDocument, rootSelector: string) => ReactNode;
  extensions?: any[];
  isEmpty?: boolean;
};

type ReactNode = import('react').ReactNode;

/**
 * Minimal SyncMarkdownView replacement.
 *
 * The original component used a sandboxed iframe with DOMPurify. This
 * placeholder renders content as plain text to avoid XSS.
 *
 * TODO: integrate DOMPurify + a markdown-to-HTML pipeline for production use.
 */
export const SyncMarkdownView: FC<SyncMarkdownViewProps> = ({
  content,
  inline,
  isEmpty,
}) => {
  if (isEmpty || !content) {
    return null;
  }

  const Tag = inline ? 'span' : 'div';
  return (
    <Tag className="co-markdown-view" style={{ whiteSpace: 'pre-wrap' }}>
      {content}
    </Tag>
  );
};

SyncMarkdownView.displayName = 'SyncMarkdownView';
