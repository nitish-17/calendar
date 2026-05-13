# Bottom Bar Evolution & Optimization

## System Log

### Architectural Decisions
- **Iconic Consistency:** Replaced the generic `Settings` (cog) icon with `Wand2` (magic wand) to create a direct visual link between the navigation and the primary "Activity" management section.
- **Improved Representation:** Switched the Week View icon to `Columns3` to better represent the multi-column nature of the weekly timeline.
- **Ergonomic Single-Row Layout:** After experimenting with a two-line layout, reverted to a single-line configuration to maximize vertical screen real estate. The new order (`Week | Day | < Today > | Settings`) groups temporal views together and places global navigation at the edges.
- **Ultra-Compact Aesthetics:** Standardized all icons to `w-5 h-5` and reduced padding to the absolute minimum (`p-1`). This allows for a very narrow footer (`h-12`) that feels professional and unobtrusive on mobile devices.

### Code Delta
- `src/components/layout/BottomNavigation.tsx`:
    - Updated imports for `Columns3` and `Wand2`.
    - Refactored JSX to a single-row flex container with `justify-around`.
    - Grouped date navigation (Prev, Today, Next) into a central sub-container with `gap-4`.
    - Applied uniform sizing and minimal padding to all buttons.
- `src/components/layout/MobileLayout.tsx`:
    - Reverted footer height to `h-12` to match the compact single-line navigation.

### Trade-offs
- **Tap Target Size:** Reducing icon size and padding makes the tap targets smaller. However, the use of `justify-around` ensures maximum horizontal separation between buttons, mitigating the risk of accidental taps on high-density mobile displays.
- **Visual Balance vs. Complexity:** The single-line layout is visually simpler but packs more controls into one row. This trade-off was chosen to prioritize a "minimalist" look while keeping all critical functions accessible with one tap.
