# Brand Colours — Aléxis "Lex" Almeida Tattoo

Source of truth for all visual tokens. CSS implementation lives in [`app/globals.css`](app/globals.css).

## Primitive palette

| Name | Hex | Description |
|------|-----|-------------|
| Dusty white | `#FDFCF3` | Light canvas, text on dark backgrounds |
| Granite | `#2C2D27` | Dark base, body copy on light, hero chrome |
| Foggy gray | `#646661` | Muted text, borders, secondary UI |
| Alarm yellow | `#FFD63D` | Primary accent, CTAs, interactive highlights |

> **Rule:** Never use pure black (`#000000`) or near-black (`#0a0a0a`, `#111`, `#0d0d0d`). Granite is the darkest allowed value.

---

## Style themes

### Fine-line (default — `data-artist-style="fine-line"`)

Yellow-forward light mode. Canvas is dusty white with a subtle alarm-yellow tint.

| Token | Value |
|-------|-------|
| `--surface` | `#FDFCF3` (dusty white) |
| `--fg` | `#2C2D27` (granite) |
| `--fg-muted` | `#646661` (foggy gray) |
| `--accent` | `#FFD63D` (alarm yellow) |
| `--on-accent` | `#2C2D27` (granite — text/icons on yellow buttons) |
| `--hero-void` | `#2C2D27` (granite — darkest section background) |
| `--surface-muted`, `--card`, `--card-alt` | Dusty white + small yellow tint via `color-mix` |
| `--border` | Foggy gray blended with surface |

### Blackwork (`data-artist-style="blackwork"`)

Granite dark mode. Canvas is granite with foggy-gray elevation; same alarm-yellow accent.

| Token | Value |
|-------|-------|
| `--surface` | `#2C2D27` (granite) |
| `--fg` | `#FDFCF3` (dusty white) |
| `--fg-muted` | foggy gray + dusty white blend |
| `--accent` | `#FFD63D` (alarm yellow — consistent across both modes) |
| `--on-accent` | `#2C2D27` (granite — always dark on yellow) |
| `--hero-void` | `#2C2D27` (granite) |
| `--surface-muted`, `--card`, `--card-alt` | Granite + foggy-gray blend (elevated) |

---

## Tailwind utility names

The following Tailwind classes are available anywhere in the codebase:

```
bg-surface          text-fg           border-border
bg-surface-muted    text-fg-muted     bg-accent
bg-card             bg-card-alt       text-on-accent
bg-hero-void

bg-brand-granite    bg-brand-dusty-white
bg-brand-yellow     bg-brand-foggy-gray
```

`text-on-accent` (maps to granite) must be used on all elements with `bg-accent`, including CTA buttons, style switcher active state, and language switcher selected option.

---

## Do not use

- `text-white` on `bg-accent` — use `text-on-accent` instead.
- `#000`, `#000000`, `#0a0a0a`, `#111`, `#111111`, `#0d0d0d`, `#050505`, `bg-black`.
- Raw `bg-ink` for theme-invariant dark bands — use `bg-brand-granite` so the band stays dark in both modes.
