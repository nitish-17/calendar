- At the top of calendar, instead of just showing "Thursday", show "Thursday, May 7th" etc.
- if the text in the calendar card is long, instead of showing one line and ending it with ..., try to wrap the text so that all text is visible (if there is enough space.)

## System Log - 2026-05-07

### Architectural Decisions
- **Enhanced Date Headers**: Implemented a custom `dayHeaderContent` in `CalendarCore.tsx` to display dates in a more human-readable format (e.g., "Thursday, May 7th"). This involves a helper logic to determine the correct ordinal suffix (st, nd, rd, th) based on the day of the month.
- **Improved Title Visibility**: Refactored the title rendering in `EventCard.tsx` to support text wrapping. Replaced `truncate` with `whitespace-normal break-words` to ensure long event titles are fully visible when there is sufficient space.

### Code Delta
- **`src/components/calendar/CalendarCore.tsx`**: Added `dayHeaderContent` prop to `FullCalendar` for custom date formatting.
- **`src/components/calendar/EventCard.tsx`**: Updated CSS classes on the event title to enable wrapping and adjusted alignment to `items-start`.
