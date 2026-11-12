@AGENTS.md
# userEmail
The user's email address is mike@drifter.agency.
# currentDate
Today's date is 2026-05-18.
# client
Client name: Alexis "Lex" Almeida
Business: Lex Almeida Tattoo Artist
Project slug: pt-c-alexisalmeida
Location: Porto, Portugal (also Germany)
Instagram: @alexis.tattoo.art
Domain: lextattoo.com
Style: Fine line, blackwork, dark art, neo-traditional. Custom only, no flash.
Brand adjectives: dark, refined, uncompromising, collector-grade, industrial, editorial
Primary colours: #FAF3E1 (linen), #F5E7C6 (cotton), #222222 (black), #FF6D1F (tangerine accent)
Font choice: Archivo Black (display), Inter (body), IBM Plex Mono (labels/metadata)
Cal.com username: lextattoo (to be confirmed)
Supabase project: pt-c-alexisalmeida (to be created)
Vercel project: pt-c-alexisalmeida (to be created)
Design reference: Swiss Industrial Print brutalism, light substrate, heavy sans macro-type, visible grid lines, monospace labels, tangerine accent CTAs
IMPORTANT: Light-mode only. Sans-serif only. No serif fonts.
IMPORTANT: This site MUST NOT share any layout patterns with pt-c-aura-web or pt-c-fabiocoelho.
IMPORTANT: Logos and portfolio/Open Graph imagery must come only from `/public/img` files supplied by the client (defaults in `src/config/branding.ts`). Do NOT AI-generate or substitute unofficial logo or OG artwork.

# legacy-context (kept for reference only)
## Business
- **Name:** Aléxis "Lex" Almeida Tattoo

## Business
- **Name:** Aléxis "Lex" Almeida Tattoo
- **Artist:** Aléxis Almeida
- **Location:** Rua do Paraíso 82, 4000-374 Porto, Portugal (also operates in Germany)
- **Phone:** +351 934 613 635
- **Email:** alexis.almeida.cc@gmail.com
- **Instagram:** [@alexis.tattoo.art](https://www.instagram.com/alexis.tattoo.art/)
- **Website (old):** https://lextattoo.com
- **Google Maps:** https://www.google.com/maps/search/?api=1&query=Aléxis%20"Lex"%20Almeida%20Tattoo&query_place_id=ChIJQTPn5ItlJA0R5Nn2vLzzKIQ

## Package
- **Tier:** Starter (website) + Growth (SMM/SEM retainer)
- **Agency:** Drifter / PortugalTattoo.com

## Design Direction
- **Palette:** Deep bronze CTA (#5a4535), obsidian text (#0d0e0f), ivory background (#f9f8f6), pewter secondary (#7a7a7a), bone accents (#e9e4dc)
- **Tone:** Premium, fine art, gallery aesthetic. Editorial and sophisticated. Understated luxury, not loud, not flash.
- **Primary language:** English (EN). Portuguese also supported.
- **Key differentiators:** 11 years experience, Porto + Germany, paints as well, premium clientele, limited availability by design

## Content Files
- `app/content/en.ts`, primary language (English)
- `app/content/pt.ts`, Portuguese version (inherited from template, needs updating)
- `app/lib/legal-entity.ts`, update NIF and legal name once confirmed by client

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- graphify-out/ is gitignored and built locally, code-only: run `graphify update .` (tree-sitter AST, no LLM, nothing leaves the machine). A SessionStart hook does this automatically when graphify is installed (`uv tool install graphifyy`). Do not run `graphify extract` with an external LLM backend in this repo.
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.
