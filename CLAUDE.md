# Visual Menu System — CLAUDE.md

A multi-tenant digital menu kiosk for restaurants. One codebase, one Vercel deployment per restaurant, selected by env var at build time.

Where you do not have the images for the items on a menu, defult to using stock images that are the actual item. 

---

## Architecture

```
restaurants/
  arco/
    config.ts       ← RestaurantConfig + categoryFallbacks
    menu.ts         ← MenuItem[]
    source/         ← PDFs, raw notes (reference only, not imported)
  blue-orchid/
    config.ts
    menu.ts
    source/
src/
  data.ts           ← loader: reads VITE_RESTAURANT_ID, re-exports DEFAULT_CONFIG / DEFAULT_MENU_ITEMS / CATEGORY_FALLBACK_IMAGES
  types.ts          ← MenuItem, RestaurantConfig, OFFICIAL_ALLERGENS
  App.tsx           ← root; reads from localStorage with data.ts as fallback
  components/
    CustomerApp.tsx ← customer-facing kiosk view
    AdminPanel.tsx  ← owner admin dashboard
    FoodAnimation.tsx
public/
  arco/             ← Arco images served at /arco/...
  blue-orchid/      ← Blue Orchid images served at /blue-orchid/...
```

**How the env var works:** `VITE_RESTAURANT_ID` is inlined at build time by Vite. Setting it to `arco` produces an Arco build; `blue-orchid` produces a Blue Orchid build. The fallback when unset is `arco`. Set this in Vercel project settings, not in `.env.local` (which is for local dev only).

**Adding a new restaurant:** follow the recipe below. Do not skip the build verification step.

---

## Adding a New Restaurant

1. **Create the folder:** `restaurants/<slug>/` where slug is lowercase-hyphenated (e.g. `la-tavola`).

2. **Write `config.ts`:**
   ```ts
   import type { RestaurantConfig } from '../../src/types';
   export const config: RestaurantConfig = {
     name: '...',
     logo: '/<slug>/logo.png',
     primaryColour: '#XXXXXX',
     accentColour: '#XXXXXX',
     welcomeMessage: '...',
     pin: '1234',
     lastUpdated: Date.now(),
   };
   export const categoryFallbacks: Record<string, string> = {
     // one entry per category, e.g.: starters: '/<slug>/starters.jpg',
   };
   ```

3. **Write `menu.ts`:** export `menuItems: MenuItem[]` populated from the restaurant's PDFs or notes in `source/`.

4. **Register in `src/data.ts`:** add two lines — one import pair and one registry entry. Follow the existing pattern exactly.

5. **Add images to `public/<slug>/`** — filenames must match the `imageUrl` values in `menu.ts` and `categoryFallbacks` in `config.ts`.

6. **Verify:** `VITE_RESTAURANT_ID=<slug> npm run build` must produce `✓ built in X.XXs` with zero errors.

7. **Create a Vercel project** linked to this repo, set `VITE_RESTAURANT_ID=<slug>` as an environment variable, deploy.

---

## Colour Rules (non-negotiable)

- `primaryColour` in config = CTA **button backgrounds only** (never text).
- Green (`#2D5E3A` for Arco) = text, borders, selection states, focus rings, hover states.
- **Never use the primary/brand colour for text.** It signals danger/error. The owner explicitly rejected red text.
- This rule applies to every restaurant — substitute their brand colour for buttons, use a contrasting dark/neutral for text.

---

## localStorage Cache (known gotcha)

The app writes `vms_menu_items` and `vms_restaurant_config` to localStorage on first load and uses those values on subsequent loads — the data.ts defaults are only the fallback when nothing is cached.

**After any restaurant data change or when switching restaurants locally:** clear localStorage in DevTools → Application → Local Storage, or use the Reset Menu button in the admin header. Without this, stale data will persist across sessions.

---

## Data Conventions

- `price` is always in **pence** (integer). £9.00 = `900`.
- `id` must be unique within a restaurant's menu (not globally). Prefix by type: `s1` starters, `m1` mains, `p1` pasta, `pz1` pizza, `de1` desserts, `dr1` drinks — or any clear scheme for non-Italian menus.
- `allergens` values must come from `OFFICIAL_ALLERGENS` in `src/types.ts` (14 UK legal allergens).
- `imageUrl` is either a full `https://` URL or a path relative to `public/` (e.g. `/arco/dish.jpg`). Prefer local images for offline reliability.
- `pairedItemIds` references ids within the same restaurant — cross-restaurant references will silently return nothing.
- Categories are free-form strings — use whatever fits the restaurant's menu structure.

---

## Session Handoff Protocol

This project uses short sessions due to credit constraints. At the end of each session:

1. Update the relevant memory file at `.claude/projects/.../memory/` with: what was completed, what's next, any decisions made.
2. Start the next session with one sentence naming exactly what that session covers and which restaurant.

**Memory files to maintain:**
- `project_arco_demo.md` — Arco status
- `project_blue_orchid.md` — Blue Orchid status (create when work starts)
- One file per new restaurant added

---

## Vercel Deployment

- **Each restaurant = one Vercel project** linked to this repo.
- Set `VITE_RESTAURANT_ID=<slug>` as a Build Environment Variable in that project's settings.
- Deploy command: `vercel deploy` (preview) or `vercel --prod` (production).
- Arco live URL: `https://menu-system-kappa.vercel.app` — Vercel project `ikomi22s-projects/menu-system`.
- GitHub repo: `https://github.com/ikomi22/menu-system-1` — every push to `main` triggers a new preview deploy.

---

## Tech Stack

React 18 · TypeScript · Vite · Tailwind CSS v4 · Framer Motion · Lucide React

No backend. All state in localStorage. Fully offline-capable once loaded.
