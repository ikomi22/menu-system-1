# Arco Visual Menu System — Design & State Document
**Date:** 2026-06-14
**Status:** Phase 1 COMPLETE — ready for next iteration

---

## Handoff: What the Next AI Needs to Know

This document describes the current implemented state of the Arco Visual Menu System (VMS). All original rebrand tasks are done. The codebase is in a clean, working state. **Do not re-implement anything described below — it is already live in the code.**

### Approach to take when resuming

1. **Read the code first, trust this doc second.** The source of truth is `src/`. This doc describes intent; the files describe reality.
2. **Check localStorage.** The app caches `vms_menu_items` and `vms_restaurant_config`. If the user says images or colours look wrong, ask them to click "Reset Menu" in the header or hard-refresh (Cmd+Shift+R). Old cached data will override code.
3. **Do not re-run any colour rebrand tasks.** The gold → red → green work is fully done.
4. **Commit cautiously.** There are uncommitted changes (see git status). Ask the user before committing — they may want to review first.
5. **Dev server:** `npm run dev` → `http://localhost:5173`. TypeScript check: `npx tsc --noEmit`.

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
| **Borders (accent)** | `#2D5E3A` + opacity variants | Category pill borders, selection rings, logo circle, nav active bar |
| **Selection tints** | `#2D5E3A/10` | Nav active bg, allergen chip selected bg, category selected bg |
| **Logo badge** | gradient `from-[#A83A35] to-[#C04840]` | The "A" badge in the top-left header — intentionally red (brand mark) |
| **Warning indicators** | `amber-400` | WifiOff icon, "Contains Allergens" badge |
| **Background** | `#1C1B19` warm charcoal | Root background |
| **Surface** | `#121212` | Header/footer |
| **Card** | `#2C2C2C` / `#2E2C28` | Card and panel backgrounds |

### Why Green Text, Not Red

The original spec had red (`#A83A35`) for all text accents. The user explicitly rejected this:

> "the red fonts are terrible.. it signals danger or error.. we want people to engage with the platform and feel enthusiastic and happy to see their food"

Red text reads as warning. Green reads as fresh, appetising, Italian (flag colours). The split is now:
- **Red = buttons** (CTAs — red on a button is bold/Italian, not alarming)
- **Green = everything else** (text, borders, selection state)

---

## Implemented Features

### 1. Full Colour Rebrand (completed)
All L'Étoile gold (`#C9A84C`) removed. All token and inline colour references updated across:
- `src/index.css` — `@theme` tokens updated; scrollbar rgba updated
- `src/data.ts` — `DEFAULT_CONFIG.primaryColour` and `accentColour` updated
- `src/App.tsx` — header, badge, mode switcher, footer
- `src/components/CustomerApp.tsx` — welcome screen, category cards, browse grid, dish detail, back navigation
- `src/components/AdminPanel.tsx` — sidebar nav, form fields, selection states, CTA button, brand preview panel
- `src/components/FoodAnimation.tsx` — sparkle particle colour and box shadow

### 2. Image Audit and Fixes (completed)
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
Key replacements made (formerly showing people, 404, or wrong food):
- s2 + s3 Garlic Bread → `photo-1476224203421` (grilled flatbread)
- s4 Bread & Oil → `photo-1476224203421`
- s6 Bruschetta → `photo-1572695157366` (actual bruschetta)
- s9 Chicken Liver Pâté → `photo-1476224203421`
- s11 Tempura Prawns → `photo-1599487488170` (fried seafood)
- s12 Mushroom Arancini → `photo-1504674900247` (food spread)
- s7 Calamari → `photo-1599487488170`
- s10 Salsiccia → `/arco/unnamed-7.jpg`
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

### 3. Lightbox (completed)
Clicking the dish image in the detail view opens a full-screen overlay. Click anywhere or press Escape to close.

Implementation notes for future reference:
- `lightboxOpen` state lives in `CustomerApp.tsx`
- The `<AnimatePresence>` lightbox block is placed at the **root** of the component return, OUTSIDE all `motion.div` elements. This is critical — Framer Motion's `transform: translateY(0px)` on animated parents creates a CSS containing block that traps `position: fixed` children. Moving the lightbox to root level fixes this.
- Escape key handler is wired via `useEffect` conditional on `lightboxOpen`

### 4. Bug Fix
- `px-[#A83A35]` on the admin panel price column `<td>` (colour used as padding — invalid Tailwind class). Corrected to `px-6 py-4`.

---

## Files Summary

| File | Role | Key classes/patterns |
|---|---|---|
| `src/index.css` | Tailwind tokens, scrollbar | `--color-gold-500: #A83A35` |
| `src/data.ts` | Menu items + DEFAULT_CONFIG | `primaryColour: '#A83A35'`, image URLs |
| `src/types.ts` | TypeScript interfaces | `MenuItem`, `RestaurantConfig` |
| `src/App.tsx` | Shell, mode switcher, framed/fullscreen | Header badge gradient stays red; all text → green |
| `src/components/CustomerApp.tsx` | Customer kiosk experience | CTA button red; text/borders green; lightbox at root |
| `src/components/AdminPanel.tsx` | Manager dashboard | Add button red; nav active border green; form focus rings green |
| `src/components/FoodAnimation.tsx` | Welcome screen sparkle particles | Particle colour `#A83A35` |
| `public/arco/` | Local restaurant photos | Served at `/arco/` path |
| `arco assets/` | Original files from client | Source copies (not directly served) |

---

## What Has NOT Been Done (potential next tasks)

These were never requested and are not yet implemented:

- **Commits** — all changes are uncommitted. Confirm with user before committing.
- **Mobile/tablet layout testing** — UI designed for landscape tablet; not verified on portrait or small screens
- **Accessibility** — no ARIA labels, contrast checks, or keyboard navigation beyond Escape on lightbox
- **Admin auth** — the admin panel has a PIN entry (`pin: '1234'` in DEFAULT_CONFIG) but no real auth
- **Real backend** — everything is localStorage only; no server persistence
- **Animations review** — FoodAnimation sparkle particles are red; the user hasn't commented on these yet
- **Category fallback images** — `CATEGORY_FALLBACK_IMAGES` in `data.ts` uses existing local files; these are shown when an item image fails to load. Not yet reviewed for quality.

---

## Verification Checklist (run after any colour changes)

```bash
# No gold remaining
grep -rn "C9A84C\|E8B84B\|d6b75f" src/

# No red text remaining (there should be zero — red is CTA backgrounds only)
grep -rn "text-\[#A83A35\]\|text-\[#C04840\]" src/

# TypeScript clean
npx tsc --noEmit

# Check for people in images (manual — view in browser)
# Use "Reset Menu" button or clear localStorage before testing
```
