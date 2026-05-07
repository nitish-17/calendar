- to make calendar cards look cooler:
- set trasparancy of 0.75
- add glow effect around it
- add glassmorphism effect to it
  update:
- why does the calendar card look exactly same as before (ie., before glassmorphism, glow and 0.75 transparancy was applied ?). it looks opaque and solid color.

## System Log - May 7, 2026

### Architectural Decisions
- **Surgical Aesthetic Integration:** Isolated the "Solo Leveling" (RPG System) look exclusively to the `EventCard` component to prevent leakage into the global FullCalendar UI.
- **Transparency Optimization:** Adjusted background opacity to **40% (0.4)** for the "glass pane" effect on cards.
- **Uniform Aura Glow:** Implemented a multi-layered `box-shadow` "aura" that applies equally to all four edges of the card.
- **Edge Consistency:** Removed the vertical left-border "power line" to ensure the card looks identical on all sides, maintaining visual balance.
- **Interaction Refinement:** Removed the global `animate-pulse` behavior in favor of a scoped `is-active-editing` state for clear, non-distracting feedback.
- Typography Preservation: Reverted global typography overrides. High-tech typography is now applied only within the `EventCard` content to preserve the clean look of the rest of the calendar.
- **Content Minimalization:** Removed the `timeText` display from the `EventCard` to reduce visual clutter and focus on the event title.

### Code Delta
- **`src/index.css`**: 
    - Added scoped utility classes `.solo-glass`, `.solo-aura`, and `.power-line`.
    - Removed all global overrides for `.fc-timegrid-event` and `.fc-timegrid-slot-label`.
- **`src/components/calendar/EventCard.tsx`**: 
    - Applies aesthetic enhancements internally using scoped classes and inline styles for dynamic colors.

### Trade-offs & Considerations
- **UI Harmony:** By isolating the "Solo Leveling" look to the cards, the application maintains its professional, clean layout while providing an immersive, high-quality experience for the core interactive elements (the events).

