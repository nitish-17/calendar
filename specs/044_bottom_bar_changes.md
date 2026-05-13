- In the settings view move the activity section to the top and make it by default in expanded state.
- In the bottom bar instead of cog icon for settings view, show the activity icon (magic wand).
- Make the bottom bar bottom line icons smaller (uniform, remove vertical padding, uniform spacing).
- Use `Columns3` for week icon in bottom bar.
- Arrange bottom bar: `Week | Day | < | Today | > | Settings`.

## System Log

### Architectural Decisions
- **Iconic Consistency:** Replaced the generic `Settings` (cog) icon with `Wand2` (magic wand) to create a direct visual link between the navigation and the primary "Activity" management section.
- **Improved Representation:** Switched the Week View icon to `Columns3` to better represent the multi-column nature of the weekly timeline.
- **Unified Navigation & Priority:** Standardized all icons to `w-5 h-5` and removed vertical padding to achieve an ultra-compact look. The new order groups temporal views and places global settings at the edge, while the Settings view now prioritizes Activity management at the top.

### Code Delta
- `src/components/layout/BottomNavigation.tsx`:
    - Updated imports for `Columns3` and `Wand2`.
    - Reordered buttons to: Week, Day, Prev, Today, Next, Settings.
    - Unified icon sizes to `w-5 h-5` and removed `p-2` padding.
    - Adjusted container to `justify-between px-4`.
- `src/components/SettingsView.tsx`:
    - Moved the Activity section to the top of the view.
    - Set the Activity section to be expanded by default (`defaultOpen={true}`).
- `src/components/layout/MobileLayout.tsx`:
    - Verified footer height remains `h-12` for compact navigation.

### Trade-offs
- **Tap Target Size:** Reducing padding makes tap targets smaller, but the use of `justify-between` with `px-4` ensures sufficient horizontal separation for mobile use.
- **Visual Balance:** The single-line layout is visually simpler but packs more controls into one row, prioritizing a minimalist look while keeping all functions one tap away.
