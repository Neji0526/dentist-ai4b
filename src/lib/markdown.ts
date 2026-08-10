/**
 * Minimal markdown renderer for CMS long-form fields (blog content, service
 * descriptions). Deliberately dependency-free and deliberately narrow.
 *
 * Security: the input is HTML-escaped *first*, then a fixed set of markdown
 * constructs is converted into tags. Raw HTML in the source is therefore
 * always rendered as text, never executed — so content written by an editor
 * (or restored from a backup) cannot inject script.
 *
 * Supported: h2/h3, paragraphs, unordered + ordered lists, blockquotes,
 * bold, italic, inline code, links.
 */

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Only http(s), mailto, tel and site-relative targets are allowed. */
function safeHref(href: string) {
  const trimmed = href.trim();
  if (/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(trimmed)) return trimmed;
  return null;
}

function renderInline(text: string) {
  let out = escapeHtml(text);

  // Links must run before emphasis so underscores inside URLs survive.
  out = out.replace(
    /\[([^\]]+)\]\(([^)\s]+)\)/g,
    (match, label: string, href: string) => {
      const safe = safeHref(href);
      if (!safe) return label;
      const external = /^https?:\/\//i.test(safe);
      const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : "";
      return `<a href="${safe}"${attrs}>${label}</a>`;
    },
  );

  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[\s(])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  out = out.replace(/(^|[\s(])_([^_\n]+)_/g, "$1<em>$2</em>");

  return out;
}

export function renderMarkdown(source: string | null | undefined): string {
  if (!source) return "";

  const blocks = source.replace(/\r\n/g, "\n").trim().split(/\n{2,}/);

  return blocks
    .map((block) => {
      const lines = block.split("\n").map((line) => line.trim());

      const heading = lines[0].match(/^(#{2,4})\s+(.*)$/);
      if (heading && lines.length === 1) {
        const level = Math.min(heading[1].length, 4);
        return `<h${level}>${renderInline(heading[2])}</h${level}>`;
      }

      if (lines.every((line) => /^[-*]\s+/.test(line))) {
        const items = lines
          .map((line) => `<li>${renderInline(line.replace(/^[-*]\s+/, ""))}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }

      if (lines.every((line) => /^\d+[.)]\s+/.test(line))) {
        const items = lines
          .map(
            (line) => `<li>${renderInline(line.replace(/^\d+[.)]\s+/, ""))}</li>`,
          )
          .join("");
        return `<ol>${items}</ol>`;
      }

      if (lines.every((line) => line.startsWith(">"))) {
        const quote = lines
          .map((line) => line.replace(/^>\s?/, ""))
          .join(" ");
        return `<blockquote>${renderInline(quote)}</blockquote>`;
      }

      return `<p>${renderInline(lines.join(" "))}</p>`;
    })
    .join("\n");
}

/** Plain-text version, for meta descriptions and excerpts. */
export function stripMarkdown(source: string | null | undefined) {
  if (!source) return "";
  return source
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
