/**
 * Markdown rendering component for the OLM plugin.
 *
 * Uses an allowlist-based HTML sanitizer to prevent XSS.
 */

import type { FC, ReactNode } from 'react';
import { useMemo } from 'react';

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

const ALLOWED_TAGS = new Set([
  'p', 'br', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code', 'pre', 'blockquote',
  'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img', 'hr', 'span', 'div',
]);
const ALLOWED_ATTRS = new Set(['href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel']);

const sanitizeHTML = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, 'text/html');

  const walk = (node: Node) => {
    const children = Array.from(node.childNodes);
    for (const child of children) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as Element;
        if (!ALLOWED_TAGS.has(el.tagName.toLowerCase())) {
          el.parentNode?.replaceChild(document.createTextNode(el.textContent || ''), el);
          continue;
        }
        for (const attr of Array.from(el.attributes)) {
          if (!ALLOWED_ATTRS.has(attr.name.toLowerCase())) {
            el.removeAttribute(attr.name);
          } else if (
            attr.name === 'href' &&
            attr.value.trim().toLowerCase().startsWith('javascript:')
          ) {
            el.removeAttribute(attr.name);
          }
        }
        if (el.tagName === 'A') {
          el.setAttribute('target', '_blank');
          el.setAttribute('rel', 'noopener noreferrer');
        }
        walk(el);
      }
    }
  };

  walk(doc.body);
  return doc.body.innerHTML;
};

export const SyncMarkdownView: FC<SyncMarkdownViewProps> = ({ content, inline, isEmpty }) => {
  const sanitized = useMemo(() => (content ? sanitizeHTML(content) : ''), [content]);

  if (isEmpty || !content) {
    return null;
  }

  const Tag = inline ? 'span' : 'div';
  return (
    <Tag
      className="co-markdown-view"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
};

SyncMarkdownView.displayName = 'SyncMarkdownView';
