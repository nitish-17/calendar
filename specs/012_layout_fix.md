- currently, the bottom bar is over the calendar, which makes it hard to access bottom part of calendar as the bottom part hides it.
- the bottom bar must be fixed below the calendar i.e., calendar container must always be above bottom bar.

update:

- the bottom bar is collapsing for some reason. fix this.

## System Log - 2026-05-07

### Architectural Decisions

- **Stack-Based Layout**: Converted the application's root structure from an overlay model (fixed bottom bar) to a vertical stack using Flexbox. This ensures that the calendar and the bottom navigation bar are distinct entities that occupy their own vertical space, preventing any overlapping or hidden content.
- **Robust Responsiveness**: Used `flex-1` for the calendar container and `shrink-0` with `min-h-16` for the bottom bar. Combined with a `flex flex-col` parent in `App.tsx`, this guarantees the calendar occupies all remaining space while the navigation bar maintains its required height across all screen sizes and prevents layout collapse.

### Code Delta

- **`src/App.tsx`**: Added `flex flex-col` to the root container to provide a stable height-aware context for its children.
- **`src/components/CalendarView.tsx`**:
  - Removed `pb-16` (the bottom bar height offset) from the main container.
  - Removed `fixed bottom-0 left-0 right-0` from the navigation bar.
  - Added `shrink-0` and `min-h-16` to the navigation bar to ensure it remains visible and consistent within the flex stack.

### Trade-offs

- **Full-Screen "Bleed"**: By moving the navigation bar into the flex stack, the calendar no longer "bleeds" behind the glassmorphism bar. While this loses a small amount of aesthetic depth, it is a necessary trade-off to ensure 100% usability of the calendar's lower timeline.

### Update - 2026-05-07 (Bottom Bar Collapse Fix)

- **Problem**: The bottom bar was collapsing/disappearing in some scenarios, likely due to the `flex-1` container of the calendar exerting too much pressure or the parent container not providing a stable flex context.
- **Solution**:
  - Added `min-h-16` to the bottom bar in `CalendarView.tsx`. This, combined with `shrink-0`, ensures the bar maintains its `4rem` height regardless of child layout pressure.
  - Updated `App.tsx` to include `flex flex-col` on the root container. This ensures that `CalendarView` (which uses `h-full`) is properly contained and its internal flex structure is respected by the browser's layout engine.
