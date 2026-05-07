- I want to see a standalone calendar with default FullCalendar features and the theme applied (`specs/002_style_theme.md`).
- I don't want to see anything else.
- Note: I just want to observe how FullCalendar behaves by default.

## System Log - 2026-05-07

### Architectural Decisions
- **Focus Mode**: Refactored `App.tsx` to remove all UI chrome (header, navigation, FAB) to meet the requirement of a standalone calendar view.
- **Full-Screen Layout**: Set the calendar container to `h-screen w-screen` to allow the calendar to dominate the viewport.
- **Theme Consistency**: Applied specific CSS variable overrides to FullCalendar's internal classes to ensure it respects the dark theme and glassmorphism style defined in `specs/002_style_theme.md`.

### Code Delta
- **`src/App.tsx`**: Simplified to a minimal wrapper around `CalendarView`.
- **`src/components/CalendarView.tsx`**: Removed the "Quick Log" FAB and adjusted padding for a cleaner edge-to-edge feel. Re-enabled the `timeGridWeek` view in the header to allow for more "default behavior" observation.
- **`src/index.css`**: Added extensive CSS overrides for FullCalendar components (buttons, borders, toolbars, slots) to align with the brand's dark aesthetic.

### Trade-offs
- **Feature Suspension**: Temporary removal of the application's core navigation and branding elements to facilitate pure UI research. These will be reinstated or integrated once the calendar behavior is validated.
- **Default Buttons**: Kept FullCalendar's default button styles but themed them with brand colors rather than replacing them with custom icons, maintaining the "default behavior" intent.
