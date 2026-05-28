import "server-only";

import DOMPurify from "isomorphic-dompurify";

/**
 * Allow-list for Tiptap-authored article HTML.
 * Tags & attributes restricted to what the Phase 4 article editor emits.
 * Re-evaluate when admin enables new Tiptap extensions (e.g. video embed).
 */
const ALLOWED_TAGS = [
  "p",
  "br",
  "hr",
  "h2",
  "h3",
  "h4",
  "strong",
  "em",
  "u",
  "s",
  "code",
  "pre",
  "blockquote",
  "ul",
  "ol",
  "li",
  "a",
  "img",
  "figure",
  "figcaption",
];

const ALLOWED_ATTR = [
  "href",
  "target",
  "rel",
  "src",
  "srcset",
  "sizes",
  "alt",
  "title",
  "width",
  "height",
  "class",
];

/**
 * Sanitize Tiptap article HTML before injecting via dangerouslySetInnerHTML.
 * Forces all outgoing links to open with safe rel attributes.
 */
export function sanitizeArticleHtml(html: string): string {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP:
      /^(?:(?:https?|mailto|tel|wa):|\/(?!\/)|#)/i,
  });

  return clean.replace(
    /<a /g,
    '<a rel="noopener noreferrer ugc" ',
  );
}
