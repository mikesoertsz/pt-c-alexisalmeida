# Public site, execution plan (Aléxis "Lex" Almeida Tattoo)

This document defines the public marketing surface, booking engine, and AI chat for the Aléxis Almeida client. Phases are tracked here and updated as work progresses.

## Feature list

- Multi-page marketing site: Home, Artists, Booking, Privacy, Terms.
- Booking: multistep wizard with reference photo uploads.
- Public streaming AI chat with studio-scoped KB retrieval.
- Content sourced from Supabase for CMS parity.

## Phased definition of done

### Phase A, Foundation

- [ ] Migrations applied to Supabase.
- [ ] Env vars documented in `.env.example`.

### Phase B, Wireframe IA

- [ ] Route groups set up.
- [ ] Home imports section components.

### Phase C, Booking MVP

- [ ] Wizard completes and persists booking.
- [ ] Confirmation state.

### Phase D, AI MVP

- [ ] Streaming chat route + UI widget.
- [ ] KB retrieval scoped by studio.
