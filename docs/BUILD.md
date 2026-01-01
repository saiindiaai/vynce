# BUILD & RUN — Development and Production

Commands (from repository root `c:\dev\vynce`):

Development (fast feedback):

```bash
npm install
npm run dev
```

Production build and start:

```bash
npm run build
npm start
```

Notes and tips:
- The app uses a single Next.js monorepo with two separate app experiences:
  - **Ecosystem** (`/ecosystem`) — launcher hub with profile, store, settings; has its own `EcoBottomNav`.
  - **Social** (`/social`) — Vynce Social app with posts, fights, capsules, etc.; has its own `BottomNav`.
  - Legacy route `/ecosystem/social` redirects to `/social` to prevent nesting and unwanted layout wrapping.
- Shared code lives in `lib/` and `config/`.
- If you run into SWC lockfile messages, re-run `npm install`. On CI, ensure the Node/npm versions match allowed versions in `package.json` `engines` or adjust as needed.
- To run a types check only:

```bash
npx tsc --noEmit
```

- If ESLint flags local unused vars during build, you can run `npm run lint` to see all and address them. I fixed the build-blocking ESLint issues; remaining warnings are safe but should be cleaned over time.
