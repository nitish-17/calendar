- use title , description fields of fullcalendar both
- instead of title and description use activity and guiding principle for labels
- show both on calendar card and the input modal as well.

## System Log - 2026-05-10

### Architectural Decisions
- **Data Mapping:** Mapped `title` to "Activity" and `description` to "Guiding Principle" to maintain compatibility with existing database schema and FullCalendar standards while fulfilling the naming requirement.
- **Extended Props:** Used FullCalendar's `extendedProps` to pass the `description` field to the `EventCard` component, as it's not a standard property in the base event object.
- **UI Enhancement:** Updated `EventCard` to include the Guiding Principle with matching font size (11px) and an italic style for distinction. Reduced card padding to `px-2 py-1` and removed all line-clamping. This prioritizes the Activity (title) text, allowing it to occupy the full card if necessary, while still showing the Guiding Principle if vertical space remains.

### Code Delta
- `src/hooks/useCalendarEvents.ts`: Added `description` to `extendedProps` in the event mapping logic.
- `src/hooks/useCalendarInteractions.ts`: Updated `handleEventClick` to include `description` when populating the modal state.
- `src/components/calendar/EventModal.tsx`:
    - Updated labels from "Title" to "Activity".
    - Added a new text `input` for "Guiding Principle" (mapped to `description`).
    - Updated `handleSave` to persist the description.
- `src/components/calendar/EventCard.tsx`: Modified the render logic to show both Activity and Guiding Principle without line-clamping, allowing natural flow and clipping.

### Trade-offs
- **FullCalendar Compatibility:** Chose to use `extendedProps` for the description instead of modifying the core FullCalendar event structure, which ensures better stability and alignment with library standards.
- **Card Space:** Removed line-clamping to prioritize information density. Content is naturally clipped by the card boundary if it exceeds the allocated time slot height.

## System Log - 2026-05-10 (B)

### Bug Fix: Midnight Scroll Issue
- **Issue:** Clicking "Today" between 12:00 AM and 1:00 AM caused the calendar to scroll to 11:xx PM (bottom of the day) instead of the top.
- **Root Cause:** The `navigate` function subtracted 1 hour from the current time for "context". At 12:45 AM, this resulted in 11:45 PM of the *previous* day. FullCalendar's `scrollToTime` interpreted the hour `23` as the end of the *current* view, causing the downward jump.
- **Fix:** Implemented a clamp in `src/hooks/useCalendarNavigation.ts`. If the hour calculation results in a negative value (before 1:00 AM), it now defaults to `00:00` (midnight), ensuring the scroll always stays within the bounds of the current day.

## System Log - 2026-05-10 (C)

### Configuration Update: Default Duration
- **Change:** Increased the default duration for new activity cards from 15 minutes to 30 minutes.
- **Implementation:** Updated `CALENDAR_CONFIG.DEFAULT_EVENT_DURATION_MINS` in `src/constants/calendar.ts`. This value is used by `useCalendarInteractions.ts` when a new card is created via double-tap to calculate the initial `end` time based on the clicked `start` time.
