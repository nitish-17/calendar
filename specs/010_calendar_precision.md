- currently minimum block of time on calendar appears to be 30 min i.e., when adding, resizing, moving etc it operates in 30 min block.
- make it 15 min instead of 30 min.

update:

- on the calendar don't show 30 min time labels like 6:30am, 7:30am etc

## System Log - 2026-05-07

### Architectural Decisions

- **Granular Time Logging**: Increased the calendar's precision by setting `slotDuration` and `snapDuration` to `00:15:00`. This allows users to log and manage events in 15-minute increments, which is essential for detailed productivity tracking.
- **Visual Consistency**: By matching the slot duration to the snap duration, the calendar's grid lines now accurately represent the minimum unit of time that can be interacted with, reducing user confusion during drag-and-drop or resizing operations.
- **Label Optimization**: Set `slotLabelInterval` to `01:00:00` to ensure only hourly markers are displayed. This declutters the time axis while maintaining the 15-minute interaction precision requested.

### Code Delta

- **`src/components/CalendarView.tsx`**: Added `slotDuration="00:15:00"`, `snapDuration="00:15:00"`, and `slotLabelInterval="01:00:00"` to the `FullCalendar` component props.

### Trade-offs

- **Vertical Space**: Decreasing the slot duration from 30 to 15 minutes increases the vertical height of the calendar for the same time range. This may require more vertical scrolling, but it is a necessary trade-off for the requested precision. The `slotMinTime` and `slotMaxTime` (if configured) or the general scrollability of the view mitigate this impact on mobile.
