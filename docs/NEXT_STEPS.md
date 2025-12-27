# NEXT_STEPS — Recommended practical next work items

Short prioritized list (actionable):

1. Implement `useEco()` hook
   - Thin wrapper over `useAppStore` + server APIs for identity, permissions, wallet, and notifications.
2. Define Eco core APIs (OpenAPI sketch)
   - `/api/auth`, `/api/identity`, `/api/permissions`, `/api/wallet`, `/api/notifications`.
3. Add an `app/eco/launch` component
   - Smooth app-launch animation and analytic event on app start.
4. Implement RBAC & Houses schema
   - DB schema (Postgres): `houses`, `house_members`, `roles`, `capabilities`.
5. Add PWA manifest + service worker in `public/` and hook install prompts in `app/eco`.

Optional (after traction):
- Extract apps to `social.vynce.xyz` with shared auth token exchange.
- Create CI pipeline that can build and deploy a single app folder independently when needed.

If you want, I can implement item 1 (`useEco()` hook) now and wire it into `components/VynceSocialUI.tsx` (non-UI changes only). Reply with `implement useEco` to proceed.
