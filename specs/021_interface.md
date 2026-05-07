- make these changes to the calendar interactivity:
  - single tap on timeline or on a card should do nothing
  - long press on timeline(not card) should do nothing
  - long press on card to put it in edit/move mode
  - double tap a card or the timeline to show the Modal/Dialog for editing text, changing color, deleting card.

## System Log - 2026-05-07

### Architectural Decisions
- **Interactivity Model:** Shifted from single-tap actions to a "Double Tap to Action, Long Press to Edit" model. This reduces accidental modal triggers and clarifies the intent of the "edit mode" (which allows dragging/resizing).
- **Long Press Implementation:** Implemented custom long-press detection within the `EventCard` component using `onPointerDown`/`onPointerUp`. This was chosen over FullCalendar's built-in `eventLongPressDelay` to decouple the *visual/state* transition to edit mode from the *physical* drag start, ensuring a clearer UI feedback loop (haptic feedback + visual rings).
- **Double Tap Detection:** Standardized double-tap logic in `useCalendarInteractions.ts` using `setTimeout` timers for both `DateClick` (timeline) and `EventClick` (cards).

### Code Delta
- **`EventCard.tsx`**: Added `longPressTimer` using `useRef` and pointer event handlers to set `editingEventId` after `CALENDAR_CONFIG.LONG_PRESS_THRESHOLD_MS` (600ms). Added haptic feedback.
- **`useCalendarInteractions.ts`**:
    - Added `dateClickTimer` for timeline double-tap.
    - Updated `handleDateClick` and `handleEventClick` to require two taps within `CALENDAR_CONFIG.DOUBLE_TAP_THRESHOLD_MS` (300ms) to open the modal.
    - Single taps no longer trigger any primary actions.
    - Tapping outside an editable event or on another event still clears the `editingEventId` but now correctly allows the double-tap sequence to proceed to the next action.
- **`useCalendarEvents.ts`**: (Already implemented) Mapped `startEditable` and `durationEditable` to `editableEventId`, ensuring only the selected event can be moved/resized.

### Trade-offs
- **Seamless Dragging:** On long-press, the event enters edit mode, but the user must release and tap again to start dragging. While slightly less "seamless" than immediate drag, it provides a much more stable experience for mobile users who might accidentally drag when trying to scroll or view details.
- **Timer Latency:** There is a slight 300ms delay on double-tap detection and 600ms on long-press, but these are consistent with OS-level interaction patterns.
