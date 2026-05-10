- instead of defaulting to creating a 30 min task, show options like 15, 30, 60, 90 in the event modal
- change the event modal labels to this:
  - activiy -> "i will"
  - <add this next> -> "for" - show circular buttons (15, 30, 60, 90) min
  - guiding principle -> "in the spirit of"
- by default keep 15 min selectd
- when you open event modal, don't focus any field on double click on timeline(to add new card) or on card (for editing)
- make color picker colapsible
- for the instead of showing dropdown(presets) for guiding principles show a small icon button to the right of the input field.

## System Log - 2026-05-10
- Updated `CALENDAR_CONFIG.DEFAULT_EVENT_DURATION_MINS` to 15.
- Refactored `EventModal.tsx`:
    - Changed labels: "Activity" -> "i will", "Guiding Principle" -> "in the spirit of".
    - Added "for" section with circular duration buttons (15, 30, 60, 90 min).
    - Made Color Picker collapsible using `isColorPickerOpen` state and `ChevronDown`/`ChevronRight` icons.
    - Replaced Principles dropdown with a `Sparkles` icon button that toggles a preset list.
    - Removed `autoFocus` from the title input.
    - Added logic to calculate and update event `end` time based on selected duration in both 'add' and 'edit' modes.
- Fixed lint error in `useGuidingPrinciples.ts` by properly handling async data fetching in `useEffect`.

## System Log - 2026-05-10 (Part 2)
- Modified `SettingsView.tsx`:
    - Set `defaultOpen={false}` for the Guiding Principles section to make it collapsed by default.
- Improved Calendar Scroll Logic:
    - Refactored `useCalendarNavigation.ts` to expose a `scrollToNow` function.
    - Updated `useCalendar.ts` to use `scrollToNow` within a `useEffect` hook.
    - The calendar now automatically applies the desired scroll (1 hour before current time) whenever the view is on the current date, ensuring consistency between clicking 'today', changing views, and initial load.

## System Log - 2026-05-10 (Part 3)
- Fixed Scroll Reset Issue:
    - Updated `useCalendarNavigation.ts`: `changeView` now explicitly calls `scrollToNow` if the calendar is viewing the current date, even if the view doesn't change. This prevents FullCalendar from resetting to its default 6am position when clicking view buttons repeatedly.
    - Updated `CalendarCore.tsx`: Added `scrollTime` prop to `FullCalendar` component, dynamically calculated as "Now - 1 hour". This sets the library's internal default scroll position to our desired "live" position, providing a fallback that prevents 6am resets during various UI interactions.
