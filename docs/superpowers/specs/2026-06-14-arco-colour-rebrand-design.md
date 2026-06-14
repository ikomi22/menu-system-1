# Arco Visual Menu System — Design & State Document
**Created:** 2026-06-14 | **Last updated:** 2026-06-14 (Session 3)
**Status:** Phase 1 + Layout Fixes + Kiosk Flow COMPLETE — committed and pushed to GitHub

---

## Handoff: What the Next AI Needs to Know

This document describes the current implemented state of the Arco Visual Menu System (VMS). All tasks up to and including Session 3 are done. The codebase is committed and pushed. **Do not re-implement anything described below — it is already live in the code.**

### Approach to take when resuming

1. **Read the code first, trust this doc second.** The source of truth is `src/`. This doc describes intent; the files describe reality.
2. **Check localStorage.** The app caches `vms_menu_items` and `vms_restaurant_config`. If the user says images or colours look wrong, ask them to click "Reset Menu" in the admin header or hard-refresh (Cmd+Shift+R). Old cached data will override code.
3. **Do not re-run any colour rebrand tasks.** The gold → red → green work is fully done.
4. **All changes are committed.** Repo is `https://github.com/ikomi22/menu-system-1` (branch: `main`).
5. **Dev server:** `npm run dev` → `http://localhost:5173`. TypeScript check: `npx tsc --noEmit`.

---

## GitHub Repository

- **Repo:** `https://github.com/ikomi22/menu-system-1`
- **Account:** `ikomi22` (user's own GitHub account)
- **Branch:** `main`

---

## Tech Stack

- **React 18**, TypeScript, Vite, Tailwind CSS v4, Framer Motion (`motion/react`)
- Tailwind v4 uses `@theme` block in `src/index.css` — colour tokens map to `text-gold-500` etc.
- State persisted in `localStorage`: keys `vms_menu_items`, `vms_restaurant_config`, `vms_offline`
- Images: local `/arco/` files served from `public/arco/`; remote Unsplash CDN for most items

---

## App Flow (Session 3 — CURRENT)

The app has a proper owner → kiosk flow. The iPad simulator/framed preview is **gone**.

```
App loads
  └─► Admin Console (default)
        └─► owner clicks "Launch Menu" (sidebar or dashboard button)
              └─► Full-screen kiosk (no admin chrome visible)
                    └─► owner taps top-right corner 5× within 3s
                          └─► PIN overlay appears
                                └─► enter PIN (default: 1234) → back to Admin Console
```

### ViewMode state (App.tsx)

| `viewMode` | What renders |
|---|---|
| `'admin'` | Admin header + AdminPanel (default on load) |
| `'kiosk'` | ONLY CustomerApp at `h-screen` — no header, no footer |

There is no longer a `isFramed` state or framed simulator. Customer mode is always full-screen.

### PIN exit (CustomerApp.tsx)

- Invisible 56×56px tap zone at `absolute top-0 right-0`
- 5 taps within 3 seconds triggers PIN overlay
- PIN checked against `config.pin` (default `'1234'`)
- **Important gotcha:** cached `vms_restaurant_config` in localStorage may not have `pin` field (added in Session 3). The check uses `config.pin ?? '1234'` as fallback. User should click "Reset Menu" to pick up the field properly, or change their PIN in settings.

---

## Implemented Colour Palette

### Final Decisions (current state of code)

| Role | Colour | Where used |
|---|---|---|
| **CTA button backgrounds** | `#A83A35` brick red | "Explore Our Menu", "Add Item", "Launch Menu" buttons |
| **CTA button hover** | `#2D5E3A` forest green | All button hover states |
| **Text accents** | `#2D5E3A` forest green | Prices, labels, back arrows, navigation, icon tints, form focus rings |
| **Text accent (opacity)** | `#2D5E3A/80`, `#2D5E3A/40` | Footer copy, subtle icon states |
| **Borders (accent)** | `#2D5E3A` + opacity variants | Category pill borders, selection rings, nav active bar |
| **Selection tints** | `#2D5E3A/10` | Nav active bg, allergen chip selected bg, category selected bg |
| **Admin header badge** | gradient `from-[#A83A35] to-[#C04840]` | The "A" badge in the top-left admin header only |
| **Warning indicators** | `amber-400` | WifiOff icon, "Contains Allergens" badge |
| **Background** | `#1C1B19` warm charcoal | Root background |
| **Surface** | `#121212` | Admin header |
| **Card** | `#2C2C2C` / `#2E2C28` | Card and panel backgrounds |

### Why Green Text, Not Red

Red (`#A83A35`) is for CTA button backgrounds only. The user explicitly rejected red text:

> "the red fonts are terrible.. it signals danger or error.. we want people to engage with the platform and feel enthusiastic and happy to see their food"

- **Red = buttons only** (CTAs — red on a button is bold/Italian, not alarming)
- **Green = everything else** (text, borders, selection state)

---

## Implemented Features

### 1. Full Colour Rebrand (completed — Session 1)
All L'Étoile gold (`#C9A84C`) removed. All token and inline colour references updated across:
- `src/index.css` — `@theme` tokens updated; scrollbar rgba updated
- `src/data.ts` — `DEFAULT_CONFIG.primaryColour` and `accentColour` updated
- `src/App.tsx` — header, badge
- `src/components/CustomerApp.tsx` — welcome screen, category cards, browse grid, dish detail, back navigation
- `src/components/AdminPanel.tsx` — sidebar nav, form fields, selection states, CTA button, brand preview panel
- `src/components/FoodAnimation.tsx` — sparkle particle colour and box shadow

### 2. Image Audit and Fixes (completed — Session 1)
All menu item images reviewed. People in photos and 404s eliminated. Current known-good assignments:

**Local arco/ files (verified correct):**
- `unnamed-2.jpg` → Seafood Linguine (p2)
- `unnamed-3.jpg` → Lamb Shank (m1) and mains fallback
- `unnamed-6.jpg` → Olives (s1) and starters fallback
- `unnamed-7.jpg` → Salsiccia starter (s10)
- `unnamed-8.jpg` → Risotto (p5)
- `unnamed-10.jpg` → Pollo Milanese + Pollo Diane (m5, m6)
- `unnamed-11.jpg` → Rope Grown Mussels (s13)
- `unnamed-12.jpg` → Lasagne (p3)
- `unnamed-13.jpg` → Ice Cream (de4) — user confirmed; file is tiramisu but stays
- `unnamed-5.jpg` → pizza fallback

**Unsplash images — verified working, no people:**
- s2 + s3 Garlic Bread → `photo-1476224203421`
- s4 Bread & Oil → `photo-1476224203421`
- s6 Bruschetta → `photo-1572695157366`
- s9 Chicken Liver Pâté → `photo-1476224203421`
- s11 Tempura Prawns → `photo-1599487488170`
- s12 Mushroom Arancini → `photo-1504674900247`
- s7 Calamari → `photo-1599487488170`
- p1 Carbonara → `photo-1612874742237`
- pz2 Prosciutto Funghi → `photo-1513104890138`
- pz3 Giardino → `photo-1565299624946`
- pz5 Diavola → `photo-1628840042765`
- pz6 Picante → `photo-1574071318508`
- p10 Arrabiata → `photo-1455619452474`
- dr3 Espresso Martini → `photo-1514362545857`
- dr4 Limoncello Iced Tea → `photo-1513558161293`
- dr6 Sangiovese Red → `photo-1474722883778`
- dr7 Pinot Grigio → `photo-1513558161293`
- dr8 Botega Prosecco → `photo-1551024709`

### 3. Lightbox (completed — Session 1)
Clicking the dish image in the detail view opens a full-screen overlay. Click anywhere or press Escape to close.

- `lightboxOpen` state lives in `CustomerApp.tsx`
- The `<AnimatePresence>` lightbox block is at the **root** of the component return, OUTSIDE all `motion.div` elements — critical to escape Framer Motion's CSS containing block
- Escape key handler wired via `useEffect` conditional on `lightboxOpen`

### 4. Welcome Screen Redesign (completed — Session 2)

- Logo: `logo.avif` rendered with `filter: invert(1)` → white on dark background. Container `max-w-sm`.
- Layout: single `justify-center gap-10` centered column (logo → tagline → CTA). No more `justify-between`.
- Bug fixed: welcome screen `motion.div` had both `absolute` and `relative` — Tailwind v4 generates `relative` after `absolute`, so `relative` won. Removed `relative`. Now `inset-0` works correctly.

### 5. Category Screen Improvements (completed — Session 2)

- Overlay gradient: `rgba(0,0,0,0.05)→0.82` (clear at top, dark at bottom)
- Category labels: `text-2xl font-bold leading-tight`
- Subtitle: `text-xs text-white/65 tracking-wide`
- **"Select" badge removed** (Session 3): the small green pill in the top-right of each card was redundant and looked out of place. Removed from all 6 category cards.

### 6. Full-Screen Kiosk Mode (completed — Session 2, restructured Session 3)

Session 2 introduced `isFramed` toggle. Session 3 removed the simulator entirely. See **App Flow** section above.

### 7. CSS Height Chain Fixes (completed — Session 2)

- **`kiosk-viewport` CSS conflict:** `src/index.css` had `.kiosk-viewport { overflow-y: auto }` overriding Tailwind. Fixed: `overflow: hidden`.
- **Tablet frame wrapper height:** Changed from `flex-1 w-full h-full` to `absolute inset-[2px]` (now irrelevant since simulator is gone, but the CSS class remains in index.css — do not revert it).

### 8. Owner Kiosk Flow with PIN Lock (completed — Session 3)

Full description in **App Flow** section above. Key files:

- `src/App.tsx` — `viewMode: 'admin' | 'kiosk'`, default `'admin'`, no `isFramed`
- `src/components/AdminPanel.tsx` — `onLaunchKiosk` prop, "Launch Menu" button in sidebar + dashboard
- `src/components/CustomerApp.tsx` — `onReturnToAdmin` prop, 5-tap corner gesture, PIN overlay
- `src/types.ts` — `pin: string` added to `RestaurantConfig`
- `src/data.ts` — `pin: '1234'` in `DEFAULT_CONFIG`

---

## Files Summary

| File | Role | Key patterns |
|---|---|---|
| `src/index.css` | Tailwind tokens, scrollbar, kiosk CSS | `.kiosk-viewport { overflow: hidden }` — do not change back to `auto` |
| `src/data.ts` | Menu items + DEFAULT_CONFIG | `primaryColour: '#A83A35'`, `pin: '1234'`, `logo: '/arco/logo.avif'` |
| `src/types.ts` | TypeScript interfaces | `MenuItem`, `RestaurantConfig` (includes `pin: string`) |
| `src/App.tsx` | Shell, admin/kiosk mode switcher | `viewMode: 'admin' \| 'kiosk'`; kiosk = early return full-screen |
| `src/components/CustomerApp.tsx` | Customer kiosk experience | 5-tap top-right → PIN overlay; `onReturnToAdmin` prop |
| `src/components/AdminPanel.tsx` | Manager dashboard | `onLaunchKiosk` prop; "Launch Menu" in sidebar + dashboard header |
| `src/components/FoodAnimation.tsx` | Sparkle particles on cards | Particle colour `#A83A35` |
| `public/arco/` | Local restaurant photos + logo | Served at `/arco/` path |
| `arco assets/` | Original client files | Source copies — not served directly |

---

## Known Gotchas (do not repeat these mistakes)

1. **`relative` + `absolute` on the same element** — Tailwind v4 generates `relative` after `absolute` in the cascade. Never put both on the same element.

2. **`kiosk-viewport` overflow** — The `.kiosk-viewport` CSS class in `index.css` appears after the Tailwind `@import`. Do not add `overflow-y: auto` back.

3. **`h-full` through `aspect-ratio` parents** — Unreliable. Use `absolute inset-0` instead.

4. **localStorage cache** — The app caches menu data and config in localStorage. After any data/type change, the user must click "Reset Menu" in the admin header or clear localStorage in DevTools. The `pin` field is a specific example: old cached configs won't have it, so the PIN check falls back to `'1234'` via `config.pin ?? '1234'`.

5. **Lightbox must be outside motion.div** — Framer Motion's animated divs create CSS containing blocks via `transform`. The lightbox `<AnimatePresence>` block must remain at the root of the CustomerApp return.

6. **No framed simulator** — It was removed in Session 3. Do not re-introduce it. The customer kiosk is always full-screen (`h-screen w-screen`).

---

## What Has NOT Been Done (potential next tasks)

- **PIN management in Settings** — owner can't change their PIN from the admin UI yet; it's hardcoded at `'1234'` in DEFAULT_CONFIG
- **Mobile/portrait layout** — UI designed for landscape tablet; not tested on portrait or small screens
- **Accessibility** — no ARIA labels, contrast checks, or keyboard navigation beyond Escape on lightbox
- **Admin auth** — login uses hardcoded `admin@arco.com / arco2024`; not real auth
- **Real backend** — everything is localStorage only; no server persistence
- **FoodAnimation review** — sparkle particles on dish cards are red (`#A83A35`); user hasn't commented on these
- **Welcome screen background image** — currently `/arco/arco1.jpg`; user hasn't reviewed or approved this choice

---

## Verification Checklist (run after any colour changes)

```bash
# No gold remaining
grep -rn "C9A84C\|E8B84B\|d6b75f" src/

# No red text remaining (red is CTA backgrounds only)
grep -rn "text-\[#A83A35\]\|text-\[#C04840\]" src/

# No relative+absolute conflict on same element
grep -n "absolute.*relative\|relative.*absolute" src/components/CustomerApp.tsx

# TypeScript clean
npx tsc --noEmit

# Manual checks in browser
# 1. App loads → Admin Console (not customer view)
# 2. "Launch Menu" button → full-screen kiosk, no header/footer visible
# 3. 5 taps on top-right corner → PIN overlay appears
# 4. Enter 1234 → back to Admin Console
# 5. Welcome screen fills edge-to-edge, logo visible, content centred
# 6. Category cards show food photos, no "Select" badge
# 7. Dish detail lightbox opens and closes
```
