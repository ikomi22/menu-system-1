# Arco Colour Rebrand — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use **superpowers:subagent-driven-development** to implement this plan. Do NOT use inline execution or executing-plans. Dispatch a fresh subagent per task, review the output between tasks, and only proceed to the next task once the current one passes verification. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace every L'Étoile gold `#C9A84C` reference with Arco's real brand palette — muted brick red `#A83A35` as the primary CTA accent, forest green `#2D5E3A` as the hover state, warm charcoal `#1C1B19` as the base background.

**Architecture:** Colour-only changes across 6 files. No layout or structural changes. The Tailwind v4 `@theme` block in `index.css` defines `gold-500` as a named colour token — updating it there covers all `text-gold-500`, `border-gold-500`, `shadow-gold-500` usages automatically. All other occurrences are inline arbitrary hex values replaced file-by-file.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS v4, Framer Motion

---

## Colour Map (reference for all tasks)

| Old | New | Role |
|---|---|---|
| `#C9A84C` | `#A83A35` | Primary accent (gold → brick red) |
| `#E8B84B` | `#C04840` | Lighter accent (gold-hi → red-hi) |
| `#d6b75f` | `#2D5E3A` | Hover colour (gold-hover → forest green) |
| `#ecd28c` | `#3A7A4C` | Hover highlight (gold-light → green-light) |
| `#0D0D0D` | `#1C1B19` | Root background (cold black → warm charcoal) |
| `rgba(201,168,76,…)` | `rgba(168,58,53,…)` | Gold in rgba form |
| `text-[#1A1A1A]` on buttons | `text-white` | Was dark text on gold bg → white on red |
| `fill-[#1A1A1A]` on icons | `fill-white` | Same — icon fill on CTA button |

---

## Task 1 — `src/index.css` + `src/data.ts`

**Files:**
- Modify: `src/index.css`
- Modify: `src/data.ts`

- [ ] **Step 1: Update the Tailwind colour token (index.css)**

Replace in `src/index.css`:

```css
/* OLD */
  --color-gold-400: #cfa845;
  --color-gold-500: #C9A84C; /* Base Brand gold */
```
→
```css
/* NEW */
  --color-gold-400: #C04840;
  --color-gold-500: #A83A35; /* Arco brick red */
```

Also replace the scrollbar rgba values in `src/index.css`:

```css
/* OLD */
  background: rgba(201, 168, 76, 0.3);
```
→
```css
/* NEW */
  background: rgba(168, 58, 53, 0.3);
```

```css
/* OLD */
  background: rgba(201, 168, 76, 0.6);
```
→
```css
/* NEW */
  background: rgba(168, 58, 53, 0.6);
```

- [ ] **Step 2: Update DEFAULT_CONFIG in data.ts**

```ts
/* OLD */
  primaryColour: '#C9A84C',
  accentColour: '#1A1A1A',
```
→
```ts
/* NEW */
  primaryColour: '#A83A35',
  accentColour: '#1C1B19',
```

- [ ] **Step 3: Verify**

```bash
grep -n "C9A84C\|cfa845\|201, 168, 76" src/index.css src/data.ts
```
Expected: zero matches.

- [ ] **Step 4: Commit**

```bash
git add src/index.css src/data.ts
git commit -m "feat: update colour tokens — gold to Arco brick red"
```

---

## Task 2 — `src/components/FoodAnimation.tsx`

**Files:**
- Modify: `src/components/FoodAnimation.tsx` (lines 87–88)

- [ ] **Step 1: Replace sparkle particle colour**

Find in `src/components/FoodAnimation.tsx`:
```ts
            background: '#C9A84C',
            boxShadow: '0 0 4px #C9A84C',
```
Replace with:
```ts
            background: '#A83A35',
            boxShadow: '0 0 4px #A83A35',
```

- [ ] **Step 2: Verify**

```bash
grep -n "C9A84C" src/components/FoodAnimation.tsx
```
Expected: zero matches.

- [ ] **Step 3: Commit**

```bash
git add src/components/FoodAnimation.tsx
git commit -m "feat: update sparkle animation colour to Arco red"
```

---

## Task 3 — `src/App.tsx`

**Files:**
- Modify: `src/App.tsx`

There are 10 colour references to update.

- [ ] **Step 1: Root background — warm charcoal**

Find:
```tsx
    <div className="min-h-screen bg-[#0D0D0D] text-slate-100 font-sans flex flex-col justify-between">
```
Replace with:
```tsx
    <div className="min-h-screen bg-[#1C1B19] text-slate-100 font-sans flex flex-col justify-between">
```

- [ ] **Step 2: Header badge — gradient + shadow**

Find:
```tsx
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#C9A84C] to-[#E8B84B] text-slate-900 font-serif font-black flex items-center justify-center text-sm shadow-lg shadow-[#C9A84C]/10">
```
Replace with:
```tsx
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#A83A35] to-[#C04840] text-white font-serif font-black flex items-center justify-center text-sm shadow-lg shadow-[#A83A35]/10">
```

- [ ] **Step 3: Restaurant name colour**

Find:
```tsx
              <h1 className="text-xs font-display font-medium tracking-widest text-[#C9A84C] uppercase">
```
Replace with:
```tsx
              <h1 className="text-xs font-display font-medium tracking-widest text-[#A83A35] uppercase">
```

- [ ] **Step 4: Crown badge — background, border, text**

Find:
```tsx
              <span className="text-[9px] uppercase font-bold tracking-widest bg-[#C9A84C]/10 border border-[#C9A84C]/20 px-1.5 py-0.5 rounded text-[#C9A84C] flex items-center gap-0.5">
```
Replace with:
```tsx
              <span className="text-[9px] uppercase font-bold tracking-widest bg-[#A83A35]/10 border border-[#A83A35]/20 px-1.5 py-0.5 rounded text-[#A83A35] flex items-center gap-0.5">
```

- [ ] **Step 5: Active mode switcher text (appears twice — Customer and Admin buttons)**

Use replace_all on:
```tsx
                ? 'bg-zinc-800 text-[#C9A84C] shadow-md border border-white/5'
```
Replace with:
```tsx
                ? 'bg-zinc-800 text-[#A83A35] shadow-md border border-white/5'
```
(replace_all: true — both switcher buttons have this identical string)

- [ ] **Step 6: "Maximize" link colour**

Find:
```tsx
                      className="text-[#C9A84C] hover:text-[#ecd28c] font-semibold underline cursor-pointer"
```
Replace with:
```tsx
                      className="text-[#A83A35] hover:text-[#2D5E3A] font-semibold underline cursor-pointer"
```

- [ ] **Step 7: Footer accent text**

Find:
```tsx
            <span className="text-[#C9A84C]/80 font-mono tracking-wider">
```
Replace with:
```tsx
            <span className="text-[#A83A35]/80 font-mono tracking-wider">
```

- [ ] **Step 8: Verify zero gold remaining**

```bash
grep -n "C9A84C\|E8B84B\|d6b75f\|ecd28c\|0D0D0D" src/App.tsx
```
Expected: zero matches.

- [ ] **Step 9: Commit**

```bash
git add src/App.tsx
git commit -m "feat: rebrand App.tsx header and footer to Arco red palette"
```

---

## Task 4 — `src/components/CustomerApp.tsx`

**Files:**
- Modify: `src/components/CustomerApp.tsx`

- [ ] **Step 1: Global hex swap — gold to red (replace_all)**

In `src/components/CustomerApp.tsx`, replace all instances:

| Find | Replace | replace_all |
|---|---|---|
| `#C9A84C` | `#A83A35` | true |
| `#E8B84B` | `#C04840` | true |

After this step there should be zero `#C9A84C` and `#E8B84B` in the file.

- [ ] **Step 2: CTA button — background warm dark, text white, hover green, shadow**

Find:
```tsx
                  className="w-full h-14 rounded-lg bg-[#A83A35] text-[#1A1A1A] font-display font-semibold uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(201,168,76,0.25)] hover:bg-[#d6b75f] transition-all cursor-pointer"
```
Replace with:
```tsx
                  className="w-full h-14 rounded-lg bg-[#A83A35] text-white font-display font-semibold uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(168,58,53,0.25)] hover:bg-[#2D5E3A] transition-all cursor-pointer"
```

- [ ] **Step 3: CTA button icon fill — dark to white**

Find:
```tsx
                  <Sparkles className="w-4 h-4 fill-[#1A1A1A]" />
```
Replace with:
```tsx
                  <Sparkles className="w-4 h-4 fill-white" />
```

- [ ] **Step 4: Category "Select" pills — add red→green hover (replace_all)**

After Step 1, the pills read:
```tsx
                  <div className="absolute top-3 right-3 text-[10px] tracking-wider font-semibold border border-[#A83A35]/30 bg-black/40 text-[#A83A35] px-2.5 py-0.5 rounded-full uppercase">
```
Replace with (replace_all: true — all 6 category cards share this identical string):
```tsx
                  <div className="absolute top-3 right-3 text-[10px] tracking-wider font-semibold border border-[#A83A35]/30 bg-black/40 text-[#A83A35] px-2.5 py-0.5 rounded-full uppercase group-hover:bg-[#2D5E3A] group-hover:text-white group-hover:border-transparent transition-all">
```

- [ ] **Step 5: Browse grid dish card — hover border to green**

Find:
```tsx
                        className="group bg-[#2C2C2C] border border-white/5 hover:border-[#A83A35]/30 rounded-xl overflow-hidden flex flex-col shadow-lg cursor-pointer transition-colors duration-300 relative"
```
Replace with:
```tsx
                        className="group bg-[#2C2C2C] border border-white/5 hover:border-[#2D5E3A]/40 rounded-xl overflow-hidden flex flex-col shadow-lg cursor-pointer transition-colors duration-300 relative"
```

- [ ] **Step 6: Pairs Well With item — border hover to green**

Find:
```tsx
                            className="flex-1 flex items-center gap-3 bg-[#2C2C2C] border border-white/5 hover:border-[#A83A35]/30 rounded-xl p-2.5 cursor-pointer transition-all group text-left"
```
Replace with:
```tsx
                            className="flex-1 flex items-center gap-3 bg-[#2C2C2C] border border-white/5 hover:border-[#2D5E3A]/30 rounded-xl p-2.5 cursor-pointer transition-all group text-left"
```

- [ ] **Step 7: Pairs Well With price — green (secondary info colour)**

Find:
```tsx
                              <span className="font-display text-[#A83A35] text-xs font-medium block mt-0.5">
```
Replace with:
```tsx
                              <span className="font-display text-[#3A7A4C] text-xs font-medium block mt-0.5">
```

- [ ] **Step 8: Verify**

```bash
grep -n "C9A84C\|E8B84B\|d6b75f\|201,168,76\|1A1A1A" src/components/CustomerApp.tsx
```
Expected: zero matches. (`#1A1A1A` remains only as a background colour in `bg-[#1A1A1A]` screen divs — those are intentional dark backgrounds, not brand colour.)

If the grep shows `bg-[#1A1A1A]` results only — that is correct and expected.

- [ ] **Step 9: Commit**

```bash
git add src/components/CustomerApp.tsx
git commit -m "feat: rebrand CustomerApp to Arco red/green palette with hover transitions"
```

---

## Task 5 — `src/components/AdminPanel.tsx`

**Files:**
- Modify: `src/components/AdminPanel.tsx`

- [ ] **Step 1: Global hex swap (replace_all)**

In `src/components/AdminPanel.tsx`, replace all instances:

| Find | Replace | replace_all |
|---|---|---|
| `#C9A84C` | `#A83A35` | true |
| `#d6b75f` | `#2D5E3A` | true |

After this step, zero `#C9A84C` should remain.

- [ ] **Step 2: "Add" / primary action button — text dark to white**

After Step 1, the Add button reads:
```tsx
                    className="bg-[#A83A35] hover:bg-[#2D5E3A] text-[#1A1A1A] text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-lg shadow-gold-500/10 cursor-pointer transition-all"
```
Replace with:
```tsx
                    className="bg-[#A83A35] hover:bg-[#2D5E3A] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-lg shadow-[#A83A35]/10 cursor-pointer transition-all"
```

- [ ] **Step 3: Brand colour preview panel — text dark to white**

After Step 1, the brand panel reads:
```tsx
              <div className="bg-[#A83A35] p-4 rounded-xl flex items-center justify-between shadow text-[#1A1A1A] gap-4 select-none">
```
Replace with:
```tsx
              <div className="bg-[#A83A35] p-4 rounded-xl flex items-center justify-between shadow text-white gap-4 select-none">
```

- [ ] **Step 4: Update stale literal text describing the old colour**

Find:
```tsx
                      <span className="text-[10px] text-slate-400 font-sans block mt-0.5">Selected brand accent. Gold (#C9A84C) is the premium default.</span>
```
Replace with:
```tsx
                      <span className="text-[10px] text-slate-400 font-sans block mt-0.5">Selected brand accent. Brick red (#A83A35) is the Arco brand colour.</span>
```

- [ ] **Step 5: Allergen availability toggle — swap amber-500 bg for red**

The availability toggle uses `bg-amber-500/10` alongside gold — this should now use the brand red tint.

Find (replace_all: true — appears on the availability toggle and in the allergen selector):
```tsx
                            : 'bg-amber-500/10 border-[#A83A35]/40 text-[#A83A35] hover:bg-amber-500/20 hover:border-[#A83A35]'
```
Replace with:
```tsx
                            : 'bg-[#A83A35]/10 border-[#A83A35]/40 text-[#A83A35] hover:bg-[#A83A35]/20 hover:border-[#A83A35]'
```

Find (the selected allergen chip state):
```tsx
                              ? 'bg-amber-500/10 border-[#A83A35] text-[#A83A35] shadow-xs' 
```
Replace with:
```tsx
                              ? 'bg-[#A83A35]/10 border-[#A83A35] text-[#A83A35] shadow-xs' 
```

Find (the selected pairing state):
```tsx
                              ? 'bg-amber-500/10 border-[#A83A35] text-slate-900 cursor-pointer'
```
Replace with:
```tsx
                              ? 'bg-[#A83A35]/10 border-[#A83A35] text-slate-900 cursor-pointer'
```

- [ ] **Step 6: Verify**

```bash
grep -n "C9A84C\|d6b75f\|gold (#C9A84C)\|amber-500/10" src/components/AdminPanel.tsx
```
Expected: zero matches.

- [ ] **Step 7: Commit**

```bash
git add src/components/AdminPanel.tsx
git commit -m "feat: rebrand AdminPanel to Arco red/green palette"
```

---

## Task 6 — Build + Verify

- [ ] **Step 1: Production build**

```bash
npm run build
```
Expected: `✓ built in X.XXs` with no TypeScript errors.

- [ ] **Step 2: Global gold grep — confirm zero matches**

```bash
grep -rn "C9A84C\|E8B84B\|d6b75f\|ecd28c\|Gold.*C9A84C\|rgba(201,168,76" src/
```
Expected: zero matches.

- [ ] **Step 3: Clear localStorage cache before testing**

The browser caches `vms_restaurant_config` including the old `primaryColour`. Open DevTools → Application → Local Storage → delete `vms_restaurant_config` (and optionally `vms_menu_items`), then reload. Alternatively, use the Reset Menu button in the app header.

- [ ] **Step 4: Start dev server and spot-check**

```bash
npm run dev
```

Open `http://localhost:3001` and verify:

- [ ] Welcome screen: logo ring is brick red, "Explore Our Menu" button is red
- [ ] Hover "Explore Our Menu" → turns forest green
- [ ] Category cards: "Select" pill is red by default, entire card hover → pill turns green
- [ ] Browse screen: prices are red; dish card hover border turns green
- [ ] Dish detail: price is red; "Pairs Well With" prices are green
- [ ] Admin panel: sidebar active item has red left border; no gold anywhere
- [ ] Admin "Add Item" button is red → green on hover
- [ ] Brand settings panel shows red preview (not gold)
- [ ] No `#C9A84C` yellow/gold visible anywhere in the UI

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete Arco brand colour rebrand — red/green Italian identity"
```
