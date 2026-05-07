- use the same exact appearance of calendar card (including default colors) , for the all day cards as well (calendar card in all day section of calendar at the very top). currently card in all day looks solid/opque.
- when creating a new calendar card, currently the default duration is set to 60 min. set the default duration to 15 min.

## System Log - 2026-05-07

### Architectural Decisions
- **Unified Event Styling:** Expanded the glassmorphism and transparency overrides to include all FullCalendar event types (`.fc-h-event`, `.fc-daygrid-event`, etc.). This ensures that all-day events at the top of the calendar share the same "Solo Leveling" aesthetic as regular events.
- **Duration Optimization:** Reduced the default event duration from 60 minutes to 15 minutes in the global configuration to better support granular time-blocking.

### Code Delta
- **`src/constants/calendar.ts`**: Updated `DEFAULT_EVENT_DURATION_MINS` to 15.
- **`src/index.css`**: 
    - Updated event overrides to target all-day and daygrid event classes.
    - Consolidated `.fc-event-main` styles for better maintainability.

### Update - 2026-05-07 (Part 2)
- **Edit Mode Refinement**: Removed the intense white glow and border from the `.is-active-editing` state to reduce visual noise.
- **New Resize Indicator**: Replaced the glowing circle resize indicator with a non-glowing `ChevronDown` icon for a cleaner, more professional look in move/edit mode.
