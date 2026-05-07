- on clicking today icon, not only should the date change to current date (or in week view, week change to current week) but it must also scroll to the time.
- the current time line (whenever possible) should appear in a position such that the last 1 hour (elapsed / before the current time line) is visible.
- the scroll should not be abrupt , it must be smooth.

## System Log - 2026-05-07

### Architectural Decisions
- **Programmatic Scrolling**: Integrated the `scrollToTime` FullCalendar API into the custom navigation logic. This ensures that the user is always presented with the most relevant part of the timeline upon returning to "Today".
- **Context-Aware Positioning**: Implemented a 1-hour lookback offset (current time - 60 minutes) to provide visual context of recently elapsed time, rather than just showing the future from the current moment.
- **CSS Smooth Scroll**: Leveraged the native CSS `scroll-behavior: smooth` on the `.fc-scroller` container. This offloads the animation work to the browser's compositor, ensuring high performance and a fluid feel on mobile devices.

### Code Delta
- **`src/components/CalendarView.tsx`**: Updated the `navigate` function to calculate the lookback time and trigger `scrollToTime`.
- **`src/index.css`**: Applied `scroll-behavior: smooth` to all FullCalendar scrollers.

### Trade-offs
- **Initial Load**: This behavior is currently tied specifically to the "Today" button. While a similar auto-scroll could be implemented on initial app load, keeping it manual for now prevents unexpected jumping if the user wants to start by looking at a different time or date.
