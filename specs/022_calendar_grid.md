- enhance the calendar grid such that i can visually tell difference between the :00 times, (:15,:45) times and :30 times.
- the weight of the line should be in this order :00 > :30 > (:15, :45) for best visual experience.
- don't affect rest of the visual appearance. keep is as it is.

## System Log - May 7, 2026

### Architectural Decisions

- **Dynamic Slot Styling:** Used FullCalendar's `slotLaneClassNames` and `slotLabelClassNames` hooks to inject time-based CSS classes. This approach is more robust than CSS `:nth-child` selectors, as it remains accurate regardless of the calendar's start hour or scroll position.
- **Opacity-Based Weighting:** Implemented visual hierarchy using border opacity rather than thickness. This maintains a high-precision, "sharp" look consistent with the project's glassmorphic aesthetic while providing clear visual cues for time intervals.

### Code Delta

- **`src/components/calendar/CalendarCore.tsx`**: Added logic to map slot start times to the correct visual line weights. Because FullCalendar styles the `border-bottom` of each slot, the class assignment is shifted:
  - **`:45` slot** -> `fc-timegrid-slot-00`: Styles the major hour line.
  - **`:15` slot** -> `fc-timegrid-slot-30`: Styles the half-hour line.
  - **`:00` & `:30` slots** -> `fc-timegrid-slot-15-45`: Styles the quarter-hour lines.
- **`src/index.css`**: Defined the opacity hierarchy:
  - `.fc-timegrid-slot-00`: `0.15` opacity (strongest)
  - `.fc-timegrid-slot-30`: `0.1` opacity (medium)
  - `.fc-timegrid-slot-15-45`: `0.05` opacity (subtle)

### Trade-offs & Observations

- **Alignment Correction:** Initial implementation incorrectly assigned the `:00` class to the slot _starting_ at `:00`, which resulted in the hour weight being applied to the line at `:15`. Corrected this by targeting the slot that _ends_ at the desired mark.
- **Visual Balance:** Maintained subtle values (`0.15/0.1/0.05`) to ensure the grid remains a background element that doesn't compete with event cards, while still being functional for quick time scanning.
