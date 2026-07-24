/**
 * SEO utility helpers — truncate meta descriptions & titles
 * to optimal lengths for search engine display.
 */

/**
 * Truncate a meta description to a maximum character length,
 * cutting at a word boundary and appending "…" if shortened.
 *
 * Google typically displays up to ~155–160 characters.
 * OpenGraph descriptions can be longer, so only use this for `<meta name="description">`.
 *
 * @param text  Raw description text
 * @param max   Maximum character count (default 155)
 */
export function truncateDescription(text: string, max = 155): string {
  if (!text) return "";
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;

  // Cut at last space before `max - 1` to leave room for "…"
  const cutoff = trimmed.lastIndexOf(" ", max - 1);
  const end = cutoff > 0 ? cutoff : max - 1;
  return trimmed.slice(0, end).replace(/[,;:\s]+$/, "") + "…";
}

/**
 * Build a page title that stays within the recommended 50–60 character range.
 *
 * Strategy:
 *   1. If `name + suffix` fits → use it.
 *   2. If only `name` fits → use name alone.
 *   3. If `name` itself is too long → truncate at word boundary + "…".
 *
 * @param name    Product / page name
 * @param suffix  Branding suffix (default " | AndisLab")
 * @param max     Maximum total title length (default 60)
 */
export function truncateTitle(
  name: string,
  suffix = " | AndisLab",
  max = 60,
): string {
  if (!name) return suffix.replace(/^\s*\|\s*/, "");
  const full = `${name}${suffix}`;
  if (full.length <= max) return full;

  // Try name-only (still under max)
  if (name.length <= max) return name;

  // Truncate name at word boundary
  const cutoff = name.lastIndexOf(" ", max - 1);
  const end = cutoff > 0 ? cutoff : max - 1;
  return name.slice(0, end).replace(/[,;:\s]+$/, "") + "…";
}
