- currently, long press puts on timeline shows input popup for adding new card
- tap, shows delete confirmation
- long press on a car puts it in edit/move mode. however, sometimes on draggin it , it moves, sometimes it doesn't (timeline simply scrolls).
- make the edit/move mode robust.
- change to this:
  - single tap on timeline: do nothing
  - double tap on timeline: add card
  - single tap on card: edit text
  - double tap on card: edit/move mode
  - long press on card: delete confirmation
- make these changes:
  - long press on card: edit/move mode
  - double tap on card: delete confirmation

update:

- show visual indicators for resizing and moving when in edit/move mode.

## System Log - 2026-05-07

### Architectural Decisions
- **Contextual Visual Cues**: Enhanced the "Move/Edit" mode by injecting dynamic icons (`GripVertical`, `ChevronUp`, `ChevronDown`) using FullCalendar's `eventContent` hook. This provides immediate visual confirmation of the event's interactive state.
- **Micro-animations**: Added a subtle `pulse` animation and a scale transition to active cards. This makes the interface feel "alive" and responsive to the user's intent.
- **Layering & Contrast**: Used a semi-transparent purple ring (`ring-4`) and increased the z-index of the active card to ensure it stands out clearly against the rest of the timeline and other events.

### Code Delta
- **`src/components/CalendarView.tsx`**:
  - Implemented `renderEventContent` to conditionally display move and resize icons based on `editableEventId`.
  - Added `scale-[1.02]` and `transition-transform` to the active card class list in `handleEventDidMount`.
  - Registered the `eventContent` hook in the `FullCalendar` component.
- **`src/index.css`**:
  - Added styles for the custom ring highlight and pulse effect.
  - Hidden the default, often difficult-to-hit FullCalendar resizers while expanding their hit area for easier touch interaction.

### Trade-offs
- **Content Real Estate**: On very short events (e.g., 15 minutes), the added icons can crowd the title. To mitigate this, icons use small sizes (`w-3 h-3`) and semi-transparency.
- **Performance**: While `eventContent` is called frequently, the logic is highly optimized (a simple ID check), ensuring no noticeable impact on scrolling performance even with many events.
