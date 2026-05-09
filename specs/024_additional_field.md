- use title , description fields of fullcalendar both
- instead of title and description use activity and guiding principle for labels
- show both on calendar card and the input modal as well.

## System Log - 2026-05-10

### Architectural Decisions
- **Data Mapping:** Mapped `title` to "Activity" and `description` to "Guiding Principle" to maintain compatibility with existing database schema and FullCalendar standards while fulfilling the naming requirement.
- **Extended Props:** Used FullCalendar's `extendedProps` to pass the `description` field to the `EventCard` component, as it's not a standard property in the base event object.
- **UI Enhancement:** Updated `EventCard` to include the Guiding Principle with matching font size (11px) and an italic style for distinction. Reduced card padding to `px-2 py-1` and allowed the Guiding Principle to display fully (no line-clamping) if space permits, while maintaining a single-line text input in the modal for efficient data entry.

### Code Delta
- `src/hooks/useCalendarEvents.ts`: Added `description` to `extendedProps` in the event mapping logic.
- `src/hooks/useCalendarInteractions.ts`: Updated `handleEventClick` to include `description` when populating the modal state.
- `src/components/calendar/EventModal.tsx`:
    - Updated labels from "Title" to "Activity".
    - Added a new text `input` for "Guiding Principle" (mapped to `description`).
    - Updated `handleSave` to persist the description.
- `src/components/calendar/EventCard.tsx`: Modified the render logic to show both Activity and Guiding Principle, using `line-clamp-2` for Activity and allowing the Guiding Principle to flow naturally.

### Trade-offs
- **FullCalendar Compatibility:** Chose to use `extendedProps` for the description instead of modifying the core FullCalendar event structure, which ensures better stability and alignment with library standards.
- **Card Space:** Applied `line-clamp-2` to the Activity to maintain structure, but allowed the Guiding Principle to show fully to prioritize information visibility when space is available.
