- in the bottom bar, place the guiding principles icon to the extereme left
- use flex or something to make all buttons in bottom bar equally spaced

## System Log - 2026-05-10

### Architectural Decisions
- **Layout Consistency:** Transitioned from a grouped "split" layout to a unified "spaced" layout. This improves accessibility on mobile by providing consistent hit areas across the entire width of the bottom bar.
- **Hierarchical Reordering:** Moved the "Guiding Principles" (presets) entry point to the extreme left, establishing it as a primary auxiliary mode.

### Code Delta
- `src/components/layout/BottomNavigation.tsx`:
    - Moved the `BookOpen` icon to the first position in the flex container.
    - Replaced `justify-between` with `justify-around` on the parent container.
    - Removed internal `div` wrappers and separators (`w-[1px]`) to allow `justify-around` to apply to all 6 buttons equally.
    - Simplified the conditional rendering logic to ensure all buttons remain visible but clearly indicate their active state across different pages.

### Trade-offs
- **Button Density:** With 6 buttons equally spaced, the touch targets are slightly closer than the previous 2-group layout, but the use of `justify-around` ensures maximum possible separation on the device width.

## System Log - 2026-05-10 (B)

### Layout Refinement: Compact Bottom Bar
- **Change:** Reduced the overall height and vertical padding of the bottom navigation bar.
- **Implementation:** 
    - Updated `src/components/layout/MobileLayout.tsx` to change footer height from `h-16 (4rem)` to `h-12 (3rem)`.
    - Adjusted `pb-24` to `pb-16` in `GuidingPrinciplesView.tsx` to maintain correct scroll clearance with the new footer height.
- **Impact:** Increases the visible area for the calendar grid and presets list while maintaining a sufficient touch target for navigation icons.
