/**
 * Formats and sanitizes product description HTML for customer-facing display.
 * Preserves rich formatting (bold, italic, lists, headings, tables, links, blockquotes)
 * while safely sanitizing unsafe scripts and event handlers.
 * Also handles legacy plain-text descriptions with line breaks.
 */
export function formatProductDescription(raw?: string | null): string {
  if (!raw) return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';

  const hasHtmlTags = /<[a-z][\s\S]*>/i.test(trimmed);

  if (!hasHtmlTags) {
    // Legacy plain text: escape HTML entities, then convert line breaks
    const escaped = trimmed
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    return escaped
      .split(/\n{2,}/)
      .map(p => `<p>${p.replace(/\n/g, '<br />')}</p>`)
      .join('');
  }

  // Sanitize rich HTML from editor
  let clean = trimmed
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove style tags and their content
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    // Remove any inline on* event handlers (e.g. onclick, onerror, onload)
    .replace(/\s*on[a-z]+\s*=\s*(["'][^"']*["']|[^\s>]+)/gi, '')
    // Neutralize javascript: in href or src
    .replace(/(href|src)\s*=\s*["']\s*javascript:[^"']*["']/gi, '$1="#"');

  return clean;
}
