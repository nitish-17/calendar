- add slight background to current day to both day and week view. but keep transparance very low like 0.01
- when i click on today icon, make sure it not only scross verticall in week view but also horizontally to show current date column.
- is there a bug, after some interaction the timeline view width widened siginifiacantly like it bacame 100-250% wide.

## System Log - 2026-05-10

### Architectural Decisions
- **View State Persistence:** Changed `initialView` to a dynamic property (`initialView={currentView}`) in `CalendarCore`. This ensures that when the component remounts (e.g., after returning from the Presets page), it matches the container width state, preventing the "widened timeline" bug where Day view was rendered in a Week view width.
- **Enhanced Visual Feedback:** Injected a very low opacity (`0.01`) background for the current day via CSS variables to provide subtle orientation without cluttering the glassmorphism aesthetic.
- **Bi-Directional Scrolling:** Updated the "Today" navigation logic to handle both vertical (FullCalendar API) and horizontal (manual `scrollLeft` calculation) scrolling. By manually targeting the horizontal container's `scrollLeft`, we avoid the bi-directional conflict caused by the native `scrollIntoView` API, ensuring that vertical time alignment remains intact.

### Code Delta
- `src/index.css`: Set `--fc-today-bg-color` to `rgba(168, 85, 247, 0.01)`.
- `src/components/calendar/CalendarCore.tsx`: Switched `initialView` from a hardcoded string to the `currentView` state variable.
- `src/hooks/useCalendarNavigation.ts`: Refactored to accept `containerRef` and implement manual horizontal centering logic.

### Bug Fixes
- **Timeline Widening:** Fixed the desync between the container width and FullCalendar's rendered view that occurred during component remounts.
- **Horizontal Orientation:** Resolved the issue where "Today" would only scroll to the correct time but leave the user on the wrong day column in Week view.
- **Scroll Conflict Fix:** Fixed a regression where vertical scrolling was broken by the horizontal `scrollIntoView` call. The logic now independently manages both axes.

## System Log - 2026-05-10 (C)

### UI Refinement: Conditional Day Headers
- **Change:** Implemented adaptive header formatting based on the active view.
- **Implementation:** Updated `dayHeaderContent` in `src/components/calendar/CalendarCore.tsx`.
    - **Day View:** Displays "Weekday, Month Date" (e.g., "Monday, May 11th").
    - **Week View:** Displays only "Month Date" (e.g., "May 11th") to save horizontal space.
- **Impact:** Provides detailed context when focusing on a single day while maintaining a clean, compact grid for the week view.

## System Log - 2026-05-10 (D)

### UI Refinement: Time Axis Optimization
- **Change:** Minimized the width of the time label column (axis) to maximize the activity grid area.
- **Implementation:** 
    - Forced the `.fc-timegrid-axis` and `.fc-timegrid-slot-label` width to `1px` with `white-space: nowrap` to shrink-wrap the text.
    - Reduced internal padding in `fc-timegrid-axis-cushion` and `fc-timegrid-slot-label-cushion`.
    - Corrected `today-bg-color` transparency to `0.01` in `src/index.css`.
- **Impact:** Creates a more focused "Day" view with significantly more horizontal space for activity titles and guiding principles.

## System Log - 2026-05-10 (B)

### Layout Refinement: Disabling All-Day Slot
- **Change:** Removed the "all-day" row from the top of the calendar grid.
- **Implementation:** Set `allDaySlot={false}` in `src/components/calendar/CalendarCore.tsx`. This maximizes vertical space for the time-grid and removes clutter for users who exclusively track time-specific activities.
