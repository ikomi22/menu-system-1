# Arco Visual Menu System — Design & State Document
**Created:** 2026-06-14 | **Last updated:** 2026-06-14 (Session 2)
**Status:** Phase 1 + Layout Fixes COMPLETE — committed and pushed to GitHub

---

## Handoff: What the Next AI Needs to Know

This document describes the current implemented state of the Arco Visual Menu System (VMS). All Phase 1 rebrand and layout fix tasks are done. The codebase is committed and pushed. **Do not re-implement anything described below — it is already live in the code.**

### Approach to take when resuming

1. **Read the code first, trust this doc second.** The source of truth is `src/`. This doc describes intent; the files describe reality.
2. **Check localStorage.** The app caches `vms_menu_items` and `vms_restaurant_config`. If the user says images or colours look wrong, ask them to click "Reset Menu" in the header or hard-refresh (Cmd+Shift+R). Old cached data will override code.
3. **Do not re-run any colour rebrand tasks.** The gold → red → green work is fully done.
4. **All changes are committed.** Repo is `https://github.com/ikomi22/menu-system-1` (branch: `main`). This replaced the old `chisomprecious02-debug/menu-system` repo.
5. **Dev server:** `npm run dev` → `http://localhost:5173`. TypeScript check: `npx tsc --noEmit`.

---

## GitHub Repository

- **Repo:** `https://github.com/ikomi22/menu-system-1`
- **Account:** `ikomi22` (user's own GitHub account)
- **Branch:** `main`
- **Previous repo:** `chisomprecious02-debug/menu-system` — no longer used

---

## Tech Stack

- **React 18**, TypeScript, Vite, Tailwind CSS v4, Framer Motion (`motion/react`)
- Tailwind v4 uses `@theme` block in `src/index.css` — colour tokens map to `text-gold-500` etc.
- State persisted in `localStorage`: keys `vms_menu_items`, `vms_restaurant_config`, `vms_offline`
- Images: local `/arco/` files served from `public/arco/`; remote Unsplash CDN for most items

---

## Implemented Colour Palette

### Final Decisions (current state of code)

| Role | Colour | Where used |
|---|---|---|
| **CTA button backgrounds** | `#A83A35` brick red | "Explore Our Menu", "Add Item" button, brand preview panel |
| **CTA button hover** | `#2D5E3A` forest green | All button hover states |
| **Text accents** | `#2D5E3A` forest green | Prices, labels, back arrows, navigation, icon tints, form focus rings |
| **Text accent (opacity)** | `#2D5E3A/80`, `#2D5E3A/40` | Footer copy, subtle icon states |
| **Borders (accent)** | `#2D5E3A` + opacity variants | Category pill borders, selection rings, nav active bar |
| **Selection tints** | `#2D5E3A/10` | Nav active bg, allergen chip selected bg, category selected bg |
| **Admin header badge** | gradient `from-[#A83A35] to-[#C04840]` | The "A" badge in the top-left admin header only |
| **Warning indicators** | `amber-400` | WifiOff icon, "Contains Allergens" badge |
| **Background** | `#1C1B19` warm charcoal | Root background |
| **Surface** | `#121212` | Admin header/footer |
| **Card** | `#2C2C2C` / `#2E2C28` | Card and panel backgrounds |

### Why Green Text, Not Red

The original spec had red (`#A83A35`) for all text accents. The user explicitly rejected this:

> "the red fonts are terrible.. it signals danger or error.. we want people to engage with the platform and feel enthusiastic and happy to see their food"

Red text reads as warning. Green reads as fresh, appetising, Italian (flag colours). The split is now:
- **Red = buttons only** (CTAs — red on a button is bold/Italian, not alarming)
- **Green = everything else** (text, borders, selection state)

---

## Implemented Features

### 1. Full Colour Rebrand (completed — Session 1)
All L'Étoile gold (`#C9A84C`) removed. All token and inline colour references updated across:
- `src/index.css` — `@theme` tokens updated; scrollbar rgba updated
- `src/data.ts` — `DEFAULT_CONFIG.primaryColour` and `accentColour` updated
- `src/App.tsx` — header, badge, mode switcher, footer
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
- s2 + s3 Garlic Bread → `photo-1476224203421` (grilled flatbread)
- s4 Bread & Oil → `photo-1476224203421`
- s6 Bruschetta → `photo-1572695157366` (actual bruschetta)
- s9 Chicken Liver Pâté → `photo-1476224203421`
- s11 Tempura Prawns → `photo-1599487488170` (fried seafood)
- s12 Mushroom Arancini → `photo-1504674900247` (food spread)
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

Implementation notes:
- `lightboxOpen` state lives in `CustomerApp.tsx`
- The `<AnimatePresence>` lightbox block is at the **root** of the component return, OUTSIDE all `motion.div` elements. Critical — Framer Motion's `transform` on animated parents creates a CSS containing block that traps `position: fixed` children.
- Escape key handler wired via `useEffect` conditional on `lightboxOpen`

### 4. Welcome Screen Redesign (completed — Session 2)

**Logo:** The actual Arco brand logo is a high-contrast Didone-style wordmark (`logo.avif` in `public/arco/`) — black text on transparent background. Displayed using CSS `filter: invert(1)` so it renders white on the dark welcome screen. Container is `max-w-sm` wide (landscape format to match the wordmark layout). No circular badge.

**Layout:** Redesigned from a `justify-between` two-section layout (content at top, button at bottom) to a single `justify-center gap-10` centered column: logo → tagline → CTA button. Removes the "squashed" feeling on varying screen heights.

**Critical bug fixed:** The welcome screen `motion.div` had both `absolute` and `relative` in the same className. In Tailwind v4's generated CSS, `relative` appears after `absolute` and wins — meaning `inset-0` had no effect and the div only sized to its content height, leaving the bottom half blank. Removing `relative` from this element fixed the full-screen blank and the dark bottom half.

### 5. Category Screen Improvements (completed — Session 2)

- **Overlay gradient** changed from `rgba(0,0,0,0.45)→0.72` (too dark, images invisible) to `rgba(0,0,0,0.05)→0.82` (clear at top, dark only at bottom for text legibility)
- **Category labels** bumped from `text-xl font-medium` to `text-2xl font-bold leading-tight`
- **Subtitle text** changed from `text-[10px] text-[#a0a0a0]` (near invisible) to `text-xs text-white/65 tracking-wide`

### 6. Full-Screen Kiosk Mode (completed — Session 2)

When the user clicks "Full Device Screen", `isFramed` is set to `false`. App.tsx now has an **early return** for `viewMode === 'customer' && !isFramed` that renders only:

```jsx
<div className="h-screen w-screen overflow-hidden bg-[#1A1A1A]">
  <CustomerApp ... onExitKiosk={() => setIsFramed(true)} />
</div>
```

This means:
- **Zero admin chrome visible** — no header, no mode switcher, no reset button
- **Proper `h-screen` height** — fixes the blank screen that occurred previously
- **Exit Kiosk Mode button** appears in the bottom-right corner of CustomerApp (only when `onExitKiosk` prop is passed), returns user to simulator view

### 7. CSS Height Chain Fixes (completed — Session 2)

Two bugs were causing the blank bottom half and blank full-screen:

**Bug A — `kiosk-viewport` CSS conflict:**
`src/index.css` defined `.kiosk-viewport { overflow-y: auto }` which appeared *after* the Tailwind import, silently overriding Tailwind's `overflow-hidden` utility. This broke the flex height chain across all screens. Fixed: changed to `overflow: hidden`.

**Bug B — Tablet frame wrapper height:**
The CustomerApp wrapper inside the framed tablet used `flex-1 w-full h-full` whose `h-full` relies on height propagating through `aspect-ratio` — unreliable across browsers. Fixed: changed to `absolute inset-[2px]` which fills the tablet frame container explicitly.

---

## App Modes Explained (important for next AI)

The app has two rendering modes controlled by `viewMode` and `isFramed` state in `App.tsx`:

| Mode | Condition | What renders |
|---|---|---|
| **Simulator (framed)** | `viewMode='customer'`, `isFramed=true` | Admin header + tablet frame chrome + CustomerApp inside frame |
| **Full-screen kiosk** | `viewMode='customer'`, `isFramed=false` | ONLY CustomerApp at `h-screen` — no header, no footer |
| **Admin console** | `viewMode='admin'` | Admin header + full AdminPanel |

The framed simulator is for developers/owners to preview. The full-screen mode is what a customer on a real tablet would see. The "Exit Kiosk Mode" button in full-screen returns to simulator.

---

## Files Summary

| File | Role | Key patterns |
|---|---|---|
| `src/index.css` | Tailwind tokens, scrollbar, kiosk CSS | `.kiosk-viewport { overflow: hidden }` — do not change back to `auto` |
| `src/data.ts` | Menu items + DEFAULT_CONFIG | `primaryColour: '#A83A35'`, `logo: '/arco/logo.avif'`, image URLs |
| `src/types.ts` | TypeScript interfaces | `MenuItem`, `RestaurantConfig` |
| `src/App.tsx` | Shell, mode switcher, framed/fullscreen | Early return for fullscreen kiosk; `absolute inset-[2px]` on tablet frame inner wrapper |
| `src/components/CustomerApp.tsx` | Customer kiosk experience | Logo via `filter: invert(1)`; welcome screen `absolute inset-0` (no `relative` conflict); lightbox at root |
| `src/components/AdminPanel.tsx` | Manager dashboard | Add button red; nav active border green; form focus rings green |
| `src/components/FoodAnimation.tsx` | Sparkle particles on cards | Particle colour `#A83A35` |
| `public/arco/` | Local restaurant photos + logo | Served at `/arco/` path |
| `arco assets/` | Original client files | Source copies — not served directly |

---

## Known Gotchas (do not repeat these mistakes)

1. **`relative` + `absolute` on the same element** — Tailwind v4 generates `relative` after `absolute` in the cascade. Never put both on the same element. If you need a positioned parent for child absolute elements, wrap in a separate `relative` container.

2. **`kiosk-viewport` overflow** — The `.kiosk-viewport` CSS class in `index.css` appears after the Tailwind `@import` and can silently override Tailwind utilities. Do not add `overflow-y: auto` back to it — individual screen divs handle their own scrolling.

3. **`h-full` through `aspect-ratio` parents** — Unreliable. If you need a child to fill a container sized by `aspect-ratio`, use `absolute inset-0` (or `inset-[Npx]`) instead of `h-full`.

4. **localStorage cache** — The app caches menu data and config in localStorage. After any data change, the user must click "Reset Menu" in the header or clear localStorage in DevTools to see changes. This catches people out repeatedly.

5. **Lightbox must be outside motion.div** — Framer Motion's animated divs create CSS containing blocks via `transform`. `position: fixed` children get trapped inside them. The lightbox `<AnimatePresence>` block must remain at the root of the CustomerApp return, after all screen divs.

---

## What Has NOT Been Done (potential next tasks)

- **Mobile/portrait layout** — UI designed for landscape tablet; not tested on portrait or small screens
- **Accessibility** — no ARIA labels, contrast checks, or keyboard navigation beyond Escape on lightbox
- **Admin auth** — PIN entry exists (`pin: '1234'` in DEFAULT_CONFIG) but is mock-only with no real auth
- **Real backend** — everything is localStorage only; no server persistence
- **FoodAnimation review** — sparkle particles on dish cards are red (`#A83A35`); user hasn't commented on these
- **Category fallback images** — `CATEGORY_FALLBACK_IMAGES` in `data.ts` used when item image fails; not reviewed for quality
- **Welcome screen background image** — currently `/arco/arco1.jpg` (restaurant interior). User hasn't reviewed or approved this choice

---

## Verification Checklist (run after any colour changes)

```bash
# No gold remaining
grep -rn "C9A84C\|E8B84B\|d6b75f" src/

# No red text remaining (red is CTA backgrounds only)
grep -rn "text-\[#A83A35\]\|text-\[#C04840\]" src/

# No relative+absolute conflict on same element (returns nothing if clean)
grep -n "absolute.*relative\|relative.*absolute" src/components/CustomerApp.tsx

# TypeScript clean
npx tsc --noEmit

# Manual checks in browser (use Full Device Screen mode)
# 1. Welcome screen fills edge-to-edge, logo visible, content centred
# 2. Category cards show food photos with legible labels
# 3. Dish detail lightbox opens and closes
# 4. Exit Kiosk Mode returns to simulator
```
