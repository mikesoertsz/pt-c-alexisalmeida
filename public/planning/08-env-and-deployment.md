# 08, Environment Variables and Deployment

---

## All environment variables

### Client-specific (change per engagement)

```env
# Public, safe to expose to the browser
NEXT_PUBLIC_BASE_URL=https://CLIENT-DOMAIN
NEXT_PUBLIC_WHATSAPP_URL=https://wa.me/351XXXXXXXXX

# Cal.com, server-only
CAL_API_KEY=cal_live_...
CAL_USERNAME=CLIENT-CAL-USERNAME
CAL_CONSULTATION_EVENT_SLUG=consultation
CAL_SESSION_EVENT_SLUG=tattoo-session
CAL_WEBHOOK_SECRET=wh_...
CAL_API_VERSION=2024-09-04

# Email, server-only
RESEND_API_KEY=re_...
EMAIL_FROM=bookings@CLIENT-DOMAIN
EMAIL_REPLY_TO=hello@CLIENT-DOMAIN

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Fixed (same for every client)

```env
CAL_API_VERSION=2024-09-04
```

---

## Vercel project configuration

| Setting | Value |
|---|---|
| Framework preset | Next.js |
| Root directory | `.` (repo root) |
| Build command | `pnpm build` |
| Output directory | `.next` |
| Node version | 20.x |
| Region | Frankfurt (EU Central), closest to Portugal |

### Adding a custom domain

1. Vercel dashboard → Project → Settings → Domains
2. Add the client's domain
3. Vercel will show the DNS records to add (CNAME or A record)
4. Update at the domain registrar
5. SSL is auto-provisioned, takes 1–5 minutes

### Environment variables in Vercel

All server-only vars must be added in Vercel dashboard → Project → Settings →
Environment Variables. Mark each as:
- `Production` only for `RESEND_API_KEY`, `CAL_API_KEY`, `CAL_WEBHOOK_SECRET`
- `Preview` + `Production` for all `NEXT_PUBLIC_*` vars

Do not commit any secrets to the repository. `.env.local` is gitignored.

---

## Branch and deployment strategy

| Branch | Environment | URL |
|---|---|---|
| `main` | Production | `https://CLIENT-DOMAIN` |
| `dev` or PR branches | Preview | `https://CLIENT-DOMAIN-git-dev-drifter.vercel.app` |

All content and code changes go through a PR branch. Review on the Vercel
preview URL before merging to `main`.

---

## Existing Vercel project

The project is already connected to Vercel (`.vercel/project.json` exists).
When onboarding a new client:
1. Either fork this repo into a new Vercel project for that client, or
2. Use Vercel's "Deploy to Vercel" flow from the cloned repo

Each client must be a separate Vercel project. Do not share a single
deployment across clients.
