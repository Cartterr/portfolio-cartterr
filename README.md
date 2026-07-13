# José Carter — Engineering Portfolio

A case-study-led portfolio for José Carter, a software engineer building reliable AI, data, scientific-computing, and autonomous systems. The site combines a React editorial frontend with a small, hardened Express contact API.

## Project structure

```text
portfolio-cartterr/
├── frontend/       React 19, TypeScript, Vite, self-hosted fonts, static media
├── backend/        Express, TypeScript, health endpoint, contact delivery
├── scripts/        Native setup and production contract checks
├── railway.json    Railway start and health-check contract
└── package.json    Root orchestration for the single deployed service
```

The production server serves the compiled frontend and the same-origin API from one process. The public endpoints are:

- `GET /` — Software portfolio
- `GET /visual` — Visual portfolio
- `GET /visual/` — permanent redirect to `/visual`
- `GET /api/health`
- `POST /api/contact`

The Vite application under `frontend/` builds separate Software and Visual HTML documents. Express serves only those explicit document routes, known static files, and the same-origin API; unknown documents and missing assets return real `404` responses.

## Native Windows setup

Prerequisites:

- Node.js 24.x
- npm 10 or newer
- PowerShell

From PowerShell in the repository root:

```powershell
npm install
npm run dev
```

The Vite development server runs the frontend and proxies `/api` to the Express development server.

## Environment

Configure these names in the runtime environment; never commit their values:

- `PORT`
- `NODE_ENV`
- `FRONTEND_URL`
- `SMTP_USER`
- `SMTP_PASS`

The SMTP variables are required only for live contact delivery. Health checks and the static portfolio do not require mail credentials.

## Verification and production commands

```powershell
npm test
npm run lint
npm run type-check
npm run build
npm run start
```

Backend tests cover API validation, IPv6-aware proxy rate limiting, safe parser failures, canonical-host behavior, and cache headers. Frontend tests cover the content contract, navigation, responsive structure, and accessible contact states. The root test also builds the backend and runs a compiled production HTTP smoke across both documents, redirects, health, and real asset `404`s.

## Railway deployment

The production architecture is a single GitHub-connected Railway service:

```text
GitHub or Railway CLI → Railway Railpack → npm run build → npm run start
```

Railway activates a deployment only after `GET /api/health` succeeds within the configured health-check window. The canonical site is `https://josecarter.dev/`; `www.josecarter.dev` is expected to resolve to the same service and receives a permanent redirect to the apex domain after DNS ownership and certificate validation complete.

For rollback, revert the faulty Git commit and push `main`, or select a previously successful deployment from the Railway dashboard and redeploy it. Do not place deployment credentials, Railway identifiers, or SMTP values in repository files.
