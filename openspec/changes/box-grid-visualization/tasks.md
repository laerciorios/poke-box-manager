## 1. Sprite Placeholder

- [ ] 1.1 Create `src/components/pokemon/SpritePlaceholder.tsx` — generic Pokéball-style SVG silhouette with `size` prop, muted colors from design tokens, `aria-hidden="true"`
- [ ] 1.2 Create `src/components/pokemon/index.ts` barrel export

## 2. BoxSlotCell Component

- [ ] 2.1 Create `src/components/boxes/BoxSlotCell.tsx` with CVA variants for `state` (registered, missing, empty) and `selected` (true/false)
- [ ] 2.2 Implement registered state: full-opacity sprite + green checkmark indicator in corner
- [ ] 2.3 Implement missing state: 30% opacity sprite or dark silhouette
- [ ] 2.4 Implement empty state: dashed border + "?" icon centered
- [ ] 2.5 Add hover state: shadow elevation via Tailwind `hover:` pseudo-class
- [ ] 2.6 Add selected state: accent-color border highlight
- [ ] 2.7 Integrate Next.js `Image` for lazy loading with `SpritePlaceholder` — show placeholder until `onLoad`, fade in with `--transition-fast`, handle `onError` fallback
- [ ] 2.8 Add shadcn `Tooltip` displaying Pokémon name on hover for non-empty slots
- [ ] 2.9 Add keyboard accessibility: focusable with `tabIndex={0}`, focus ring, Enter/Space triggers `onClick`

## 3. BoxGrid Component

- [ ] 3.1 Create `src/components/boxes/BoxGrid.tsx` with CSS Grid layout (`grid-cols-6`, 5 rows implied by 30 items)
- [ ] 3.2 Map `Box.slots` array to `BoxSlotCell` components, passing slot data and state
- [ ] 3.3 Add responsive breakpoints: full grid on desktop/tablet, horizontal scroll wrapper on mobile (<768px)
- [ ] 3.4 Implement `onSlotClick` callback prop and `selectedSlotIndex` prop for selection highlighting

## 4. BoxNavigation Component

- [ ] 4.1 Create `src/components/boxes/BoxNavigation.tsx` with `boxName`, `currentIndex`, `totalBoxes`, `onPrevious`, `onNext` props
- [ ] 4.2 Render previous/next arrow buttons using shadcn `Button` (ghost variant) + `lucide-react` ChevronLeft/ChevronRight icons
- [ ] 4.3 Display box name prominently and position indicator (`{currentIndex + 1} / {totalBoxes}`)
- [ ] 4.4 Disable previous button at first box, next button at last box
- [ ] 4.5 Add keyboard support: Left/Right arrow keys trigger navigation callbacks

## 5. BoxOverview Component

- [ ] 5.1 Create `src/components/boxes/BoxOverview.tsx` with `boxes` array, `activeBoxIndex`, and `onSelectBox` props
- [ ] 5.2 Render each box as a miniature 6×5 grid of small colored dots (green=registered, orange=missing, transparent=empty)
- [ ] 5.3 Display box name label for each mini-grid
- [ ] 5.4 Implement click-to-navigate: clicking a mini-grid calls `onSelectBox(index)`
- [ ] 5.5 Highlight active box mini-grid with accent-color border

## 6. Barrel Export & Verification

- [ ] 6.1 Create `src/components/boxes/index.ts` barrel export for BoxGrid, BoxSlotCell, BoxNavigation, BoxOverview
- [ ] 6.2 Verify TypeScript compilation passes with `tsc --noEmit`
