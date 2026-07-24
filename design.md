# Design — AndisLab (`tokoandis`)

A locked design system for this app. Every page and component redesign reads this file before emitting code. Do not regenerate per page — extend or amend this file when the system needs to grow.

---

## Genre
**modern-minimal** (Stripe / Linear / Vercel school tailored for high-trust scientific B2B distributor)

## Macrostructure Family
Pick one base macrostructure for marketing pages, one for app/catalog pages, one for content pages. Pages within a family share the family's shape; they vary only in component archetypes.

- **Marketing pages (`/page.tsx`, `/promo-merdeka`)**: *Marquee Hero* (H1 big statement, left-bias or center, strong typographic hierarchy) + floating pill/SaaS nav (`N5 / N1b`) & statement footer (`Ft5`).
- **App & Catalog pages (`/katalog`, `/ready-stock`, `RFQCartDrawer.tsx`)**: *Workbench / Bento Grid* — high information density, precise alignment, clear tabular/card grid, functional filter bars.
- **Content pages (`/tentang`, `/artikel/*`, `/kebijakan-privasi`, `/syarat-ketentuan`)**: *Long Document* — comfortable reading measure (65–75 characters), clear vertical hierarchy, subtle left-hand or top TOC.

## Theme
Anchored on AndisLab's existing primary brand (`#2563eb` Royal Blue) & secondary cyan (`#06b6d4`), refined into pure OKLCH design tokens:
- `--color-paper`: `oklch(98.5% 0.005 240)` (`#f8fafc` surface clean)
- `--color-paper-2`: `oklch(100% 0 0)` (`#ffffff` pure white card surface)
- `--color-paper-dark`: `oklch(15% 0.03 260)` (`#0f172a` slate dark mode / header)
- `--color-ink`: `oklch(15% 0.03 260)` (`#0f172a` primary text contrast ≥ 12:1)
- `--color-ink-2`: `oklch(45% 0.03 260)` (`#64748b` secondary muted copy)
- `--color-rule`: `oklch(91% 0.01 260)` (`#e2e8f0` crisp structural borders)
- `--color-accent`: `oklch(55% 0.22 260)` (`#2563eb` AndisLab Primary Brand Blue)
- `--color-accent-ink`: `oklch(99% 0 0)` (`#ffffff` text on primary accent)
- `--color-accent-light`: `oklch(78% 0.16 200)` (`#22d3ee` Cyan Highlight)
- `--color-focus`: `oklch(55% 0.22 260)` (`#2563eb` instant visible focus ring)

## Typography
- **Display**: `Inter`, weight `700` / `800`, style `normal` (*Strict rule: No italic headers per gate 38a*).
- **Body**: `Inter`, weight `400` / `500`, style `normal`.
- **Mono**: `Geist Mono` / `ui-monospace`, weight `400` (for SKU codes, specs, RFQ item numbers).
- **Display tracking**: `-0.025em` to `-0.035em` for high-impact headers.
- **Type scale anchor**: `--text-display: clamp(2.25rem, 4vw + 1rem, 3.75rem)`.

## Spacing
4-point named scale aligned with Tailwind v4 `@theme inline`:
- `--space-3xs`: `0.25rem` (4px)
- `--space-2xs`: `0.5rem` (8px)
- `--space-xs`: `0.75rem` (12px)
- `--space-sm`: `1rem` (16px)
- `--space-md`: `1.5rem` (24px)
- `--space-lg`: `2rem` (32px)
- `--space-xl`: `3rem` (48px)
- `--space-2xl`: `4.5rem` (72px)
- `--space-3xl`: `7rem` (112px)

## Motion
- **Stance**: `motion-cut` — functional, crisp, minimal (< 3 primitives per page).
- **Easings**:
  - `--ease-out`: `cubic-bezier(0.16, 1, 0.3, 1)` (snappy entry)
  - `--ease-in-out`: `cubic-bezier(0.65, 0, 0.35, 1)` (smooth transition)
- **Reveal pattern**: subtle opacity + `translateY(12px)` (`≤ 220ms`).
- **Reduced-motion fallback**: `opacity`-only crossfade, `≤ 150ms` (Gate 41).

## Microinteractions Stance
- **Strict 8-State UI Discipline**: Every interactive element (`ProductCard`, `Button`, `WaLinkCTA`, `RFQCartDrawer`, `Input`) MUST style all 8 states:
  1. `default`
  2. `hover` (elevation or subtle background shift, never layout jump)
  3. `:focus-visible` (instant `2px solid var(--color-focus)` ring, no fade animation)
  4. `:active` (`translateY(1px)` tactile depress)
  5. `disabled` (opacity 50%, `cursor-not-allowed`)
  6. `loading` (spinner / shimmer without shifting dimensions)
  7. `error` (`#ef4444` border + immediate clear message)
  8. `success` (`#10b981` confirmation indicator)
- **Tooltips/Popovers**: Hover delay `800ms`, Focus delay `0ms`.
- **Feedback**: *Silent success / optimistic updates* over disruptive celebratory modals/toasts.

## CTA Voice
- **Primary CTA (`/ WhatsApp / RFQ Quote`)**: Solid fill `--color-accent` (`#2563eb`), `rounded-xl` or `rounded-full`, `font-semibold`, subtle shadow + hover elevation (`shadow-md` → `shadow-lg`).
- **Secondary CTA (`/ Detail Produk / Filter`)**: Outline `1.5px solid var(--color-rule)`, `rounded-xl` or `rounded-full`, hover `bg-[var(--color-paper-2)]`.

## Per-Page Allowances
- **Marketing pages (`/`, `/promo-merdeka`)** MAY use enrichment (Tier-A pure CSS art / Tier-B hand-built SVG, e.g., laboratory equipment vector silhouettes or subtle abstract lab-grid overlays).
- **App & Catalog pages (`/katalog`, `/ready-stock`, `RFQCartDrawer.tsx`)** MUST NOT use enrichment — function, clarity of chemical specs, and speed carry the page.
- **Content pages (`/tentang`, `/artikel/*`)**: Typography-only, zero background clutter.

## What Pages MUST Share
- The wordmark / logotype (`AndisLab`).
- The accent colour (`#2563eb`) and its placement (`≤ 5%` total viewport surface — never overwhelming blue sludge).
- The display + body fonts (`Inter` upright).
- The CTA voice (button shapes, border-radius `--radius-xl: 0.75rem`, padding rhythm).
- Section heading rhythm (vertical stacked: `eyebrow/tag above` → `heading directly below` in one column). *Note: The tag-left / heading-right 2-column hanging header pattern is explicitly BANNED per Gate 54.*
- **Antigravity Global Rules Compatibility**:
  - Uang = `Decimal @db.Decimal(16,2)` / diolah menggunakan `decimal.js` (jangan pernah ganti ke float/number JS di logika transaksi).
  - Jangan pernah merusak alur pipa RFQ (`Inquiry → Quotation → Project → Invoice`).

## What Pages MAY Differ On
- Macrostructure within the page-type family (`Marquee Hero` vs `Stat-Led` vs `Workbench`).
- Hero archetype (within family allowance).
- Enrichment — only on marketing pages, strictly Tier-A or Tier-B.

---

## Exports

### tokens.css
```css
:root {
  --color-paper:      oklch(98.5% 0.005 240);
  --color-paper-2:    oklch(100% 0 0);
  --color-ink:        oklch(15% 0.03 260);
  --color-ink-2:      oklch(45% 0.03 260);
  --color-rule:       oklch(91% 0.01 260);
  --color-accent:     oklch(55% 0.22 260);
  --color-accent-ink: oklch(99% 0 0);
  --color-focus:      oklch(55% 0.22 260);

  --font-display: var(--font-inter, "Inter", sans-serif);
  --font-body:    var(--font-inter, "Inter", sans-serif);
  --font-mono:    var(--font-geist-mono, "Geist Mono", monospace);

  --space-3xs: 0.25rem;  --space-2xs: 0.5rem;  --space-xs: 0.75rem;
  --space-sm:  1rem;     --space-md:  1.5rem;  --space-lg: 2rem;
  --space-xl:  3rem;     --space-2xl: 4.5rem;  --space-3xl: 7rem;

  --text-xs: 0.75rem;  --text-sm: 0.875rem; --text-md: 1.125rem;
  --text-lg: 1.375rem; --text-xl: 1.75rem;  --text-2xl: 2.25rem;

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-short: 220ms;

  --radius-card: 1rem; --radius-pill: 9999px; --radius-input: 0.75rem;
}
```

### Tailwind v4 `@theme` (Compatible with `globals.css`)
```css
@theme inline {
  --color-background: var(--color-paper);
  --color-foreground: var(--color-ink);
  --color-primary: var(--color-accent);
  --color-primary-dark: #1d4ed8;
  --color-accent: #06b6d4;
  --color-surface: var(--color-paper);
  --color-card: var(--color-paper-2);
  --color-muted: var(--color-ink-2);
  --color-border: var(--color-rule);
  --font-sans: var(--font-inter);
}
```

### DTCG `tokens.json`
```json
{
  "color": {
    "paper":  { "$value": "oklch(98.5% 0.005 240)", "$type": "color" },
    "ink":    { "$value": "oklch(15% 0.03 260)", "$type": "color" },
    "accent": { "$value": "oklch(55% 0.22 260)", "$type": "color" }
  },
  "font": {
    "display": { "$value": "Inter", "$type": "fontFamily" },
    "body":    { "$value": "Inter", "$type": "fontFamily" }
  },
  "space": {
    "md": { "$value": "1.5rem", "$type": "dimension" }
  }
}
```

### shadcn/ui CSS variables
```css
:root {
  --background:        98.5% 0.005 240;
  --foreground:        15%   0.03  260;
  --primary:           55%   0.22  260;
  --primary-foreground: 99%  0     0;
  --muted:             91%   0.01  260;
  --muted-foreground:  45%   0.03  260;
  --border:            91%   0.01  260;
  --input:             91%   0.01  260;
  --ring:              55%   0.22  260;
  --radius:            0.75rem;
}
```
