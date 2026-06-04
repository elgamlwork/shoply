# Shoply — The Edit

> A small, opinionated commerce catalog built as a frontend technical task. Editorial design, real JWT auth via [DummyJSON](https://dummyjson.com), infinite-scroll product grid with search / category / sort, dark mode, favorites, and tests.

Live demo: **[shoply.elgaml.dev](https://shoply.elgaml.dev/)**  ·  API: [DummyJSON](https://dummyjson.com/docs)  ·  Postman: [`postman/shoply.postman_collection.json`](./postman/shoply.postman_collection.json)

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) | SSR, route handlers, Edge proxy, server components |
| Language | **TypeScript 5** (strict) | Type-safe API contracts |
| UI | **React 19** + **Tailwind CSS v4** + `next/font` (Fraunces + Inter) | Editorial typography, CSS-first theming |
| Server state / caching | **TanStack Query v5** (`useQuery`, `useInfiniteQuery`) | Required "caching management" |
| Client state | **Zustand v5** (+ persist middleware) | Auth, favorites, theme |
| Forms | **react-hook-form** + **zod** | Validated, accessible forms |
| Auth | **jose** (HS256 JWT) in httpOnly cookies | Real JWT signed by our server, validated by proxy |
| Icons | **lucide-react** | Consistent line iconography |
| Animation | **motion** (formerly framer-motion) | Reserved for richer interactions |
| Testing | **Vitest 4** + **@testing-library/react** + **jsdom** | Unit + component coverage |
| Lint | **ESLint 9** (flat config) + **next/core-web-vitals** | Strict React 19 rules |

## Highlights

- **Real JWT auth** — DummyJSON `/auth/login` is proxied through our `/api/auth/login` route handler. The remote response is exchanged for a JWT we sign with HS256 (`jose`), set as an `httpOnly` cookie (`shoply_at`). The Edge **proxy** (`src/proxy.ts`) gates every protected route and redirects authenticated users away from `/login` and `/register`.
- **Two auth paths, one cookie shape** — DummyJSON sign-in *and* device-local registration both end with the same JWT cookie. Local accounts hash passwords with `crypto.subtle` (SHA-256) and live in `localStorage`. Cross-device users should sign in with the DummyJSON demo.
- **Editorial Luxe design** — cream/warm-ink palette, Fraunces display serif, Inter body, hairline borders, soft hover lifts, generous whitespace. Dark mode flips the palette via a single `.dark` class on `<html>`, with a no-flash inline script set in `<head>`.
- **Infinite scroll** with `useInfiniteQuery` + IntersectionObserver, plus a "Load more" fallback. URL holds the source of truth (`?q=`, `?category=`, `?sortBy=`, `?order=`) so any filtered view is shareable.
- **Favorites** persisted to `localStorage` via Zustand `persist`. Dedicated `/favorites` page reuses the product grid.
- **Smooth states** — skeleton on first load, inline spinner on next page, retry on error, helpful empty state with reset action.
- **Tests** — 29 tests across formatters, JWT round-trip, DummyJSON URL building / response shaping, and three component flows (product card, category rail, sort menu).

## Demo credentials

```
username:  emilys
password:  emilyspass
```

The login form has a one-click "Fill" button to drop these in.

## Getting started

```bash
git clone <this-repo>
cd shoply
npm install
cp .env.example .env.local   # then edit JWT_SECRET to a real random value
npm run dev                  # http://localhost:3000
```

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_BASE` | yes | Defaults to `https://dummyjson.com`. Override for a self-hosted proxy or alternate fixture. |
| `JWT_SECRET` | yes | 32+ char random string used to sign session cookies. **Set a real value before deploying.** |

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the Next.js dev server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Run the production build locally |
| `npm run lint` | ESLint (flat config) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Vitest in watch mode |

## Project structure

```
src/
├─ app/
│  ├─ layout.tsx               # html, fonts, ThemeScript, Providers
│  ├─ providers.tsx            # QueryClient + auth hydration
│  ├─ globals.css              # Tailwind v4 @import + @theme tokens + dark mode
│  ├─ (marketing)/             # public route group (login, register)
│  ├─ (shop)/                  # protected route group (home, products, favorites)
│  ├─ api/auth/                # login | local | me | logout route handlers
│  ├─ loading.tsx / error.tsx / not-found.tsx
├─ proxy.ts                    # auth gate (Next 16 renamed middleware → proxy)
├─ components/
│  ├─ layout/                  # site-header, site-footer, hero-band
│  ├─ product/                 # product-browser, product-card, product-grid,
│  │                           # product-detail, category-rail, sort-menu
│  ├─ ui/                      # button, input, chip, skeleton, theme-toggle, …
│  └─ providers/               # query-provider, theme-script, auth-hydrator
├─ lib/
│  ├─ api/                     # client.ts (fetch wrapper) + products.ts
│  ├─ auth/                    # jwt.ts (jose), cookies.ts, store.ts, local-users.ts
│  ├─ favorites/store.ts
│  ├─ theme/store.ts
│  ├─ query/                   # client.ts (QueryClient factory) + key factory
│  └─ utils/                   # cn, format, debounce
├─ types/                      # product.ts + auth.ts
└─ test/setup.ts               # Vitest + jest-dom setup
postman/shoply.postman_collection.json
```

## API surface (DummyJSON)

| Endpoint | Purpose | Used by |
|---|---|---|
| `POST /auth/login` | Verify credentials → JWT + user | `/api/auth/login` |
| `GET /products?limit=&skip=&sortBy=&order=` | Paged list of all products | Home (no filters) |
| `GET /products/search?q=&limit=&skip=` | Full-text search | Home with `?q=` |
| `GET /products/category/{slug}?limit=&skip=` | Filter by category | Home with `?category=` |
| `GET /products/{id}` | Single product | Detail page |
| `GET /products/categories` | Category list | Category rail |

A Postman collection covering every endpoint we hit lives at [`postman/shoply.postman_collection.json`](./postman/shoply.postman_collection.json) — import it into Postman directly.

## Auth design

```
┌─────────────┐    POST /api/auth/login       ┌───────────────────┐
│  Login form │ ─────────────────────────────▶│ Route handler     │
│  (RHF+zod)  │                               │ → DummyJSON       │
└─────────────┘                               │ → mint JWT (HS256)│
                                              │ → Set-Cookie      │
                                              └─────────┬─────────┘
                                                        │ shoply_at (httpOnly, sameSite=lax)
                                                        ▼
                                              ┌───────────────────┐
                                              │ Edge proxy        │
                                              │ (src/proxy.ts)    │
                                              │ Gate protected    │
                                              │ routes by token   │
                                              │ shape + exp claim │
                                              └─────────┬─────────┘
                                                        │
                                                        ▼
                                              ┌───────────────────┐
                                              │ /api/auth/me      │
                                              │ Full jose.verify  │
                                              │ used by Zustand   │
                                              │ to hydrate UI     │
                                              └───────────────────┘
```

**Why two-tier verification?** The proxy runs on Edge and per request, so it does a cheap structural check (well-formed JWT, `exp` not in the past) — fast, no secret crypto in the hot path. The `/api/auth/me` route, called once on app mount, does the full `jose.jwtVerify` against `JWT_SECRET` to populate the client store.

**Local accounts.** DummyJSON has no `register` endpoint, so the register form hashes the password (`crypto.subtle` SHA-256), stores the user in `localStorage`, and calls `/api/auth/local` to mint the same JWT shape. The endpoint trusts the client by design — this is documented demo behavior, not a production pattern.

## Design notes

- Color tokens live in `globals.css` under `:root` and `.dark` selectors and are exposed to Tailwind via `@theme inline`. No `tailwind.config.ts` needed (Tailwind v4 is CSS-first).
- Dark mode uses a custom `@custom-variant dark (&:where(.dark, .dark *))` so the `dark:` Tailwind variant follows the `<html class="dark">` toggle.
- Fraunces is loaded with optical-size + soft + wonk axes for editorial display weight.

## Verification checklist

- [x] `npm run lint` — clean
- [x] `npm run typecheck` — clean
- [x] `npm test` — 29 / 29 passing
- [x] `npm run build` — succeeds without warnings
- [x] Manual smoke test: unauth `GET /` → 307 to `/login`; login → cookie set; `/api/auth/me` returns user; `/login` → 307 to `/` when authed; search, category, sort filter the grid; product detail loads; favorites persist across reloads; dark mode toggle persists.

## Deployment

```bash
vercel --prod
```

Set `JWT_SECRET` (and optionally `NEXT_PUBLIC_API_BASE`) in the Vercel project dashboard. No other config required — Next.js 16 + Turbopack + Edge proxy all run out of the box on Vercel.

## License

MIT — see [LICENSE](./LICENSE) if present, otherwise treat as MIT for the purposes of this submission.
