# ARCHITECTURE — Eco (Control Plane) + Apps (Staged)

Decision summary (short):

- Start with a Single Codebase Multi-App illusion: keep everything in one Next.js repo, with `app/eco` as the OS/Launcher and `app/social`, `app/connect`, `app/ai` as apps.
- `Eco` is the single source of truth: identity, XP/reputation, houses, permissions, economy, notifications, and app entitlements.
- Apps own their domain logic and UI only; read global state via Eco APIs or `useEco()` hook.

Why this choice:
- Fast iteration, single auth/session, lower friction for users, easier analytics, and fewer cross-domain edge cases.
- When traffic/teams require scaling, progressively separate by subdomain or service while preserving SSO and data contracts.

Implementation guidance (already applied partially):
- Shared modules: `lib/store.ts` (client state), `lib/themes.ts`, `config/themes.ts`.
- App surface contract: each app should depend only on a minimal `useEco()` interface for identity and permissions rather than reading cookies or duplicating auth logic.
- Routing: app routes under `app/*`. Ecosystem is at `/ecosystem`, Social is at top-level `/social`. Legacy nested route `/ecosystem/social` redirects to `/social` for backward compatibility.

Separation roadmap (short):
1. Keep single repo until product-market fit for cross-app flows is validated.
2. When ready, extract apps to subdomains and optionally separate CI/CD pipelines.
3. Maintain the Eco as the authoritative backend or move to a shared auth/gateway service.
