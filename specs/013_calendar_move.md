- when i long press calendar card, i enter edit/move mode.
- however, it randomly exists edit/move mode
- change: once it edit/move mode, it must remain in that mode until i tap somewhere outside of the card area.
- currently, the edit/move behaviour at the bottom edge is unpredictable. most of the time it drags and sometimes it resizes. i always want the bottom edge to be used for resizing and top edge or middle portion for dragging.
- visual indicators for edit/move mode, currently there is arrows at top and bottom and 6-dot-drag icon at top right. remove these. at top-middle show a horizontal line/bar indicating dragging and at bottom-middle show a circle indicating resizeing.

### Update - 2026-05-07 (Robust Resizer Fix)
- **Problem**: Resizing was only functional near the center indicator, as FullCalendar's default styles or internal logic were restricting the resizer hit area.
- **Solution**: 
  - **Double Enforcement**: Applied the fix via both CSS and JavaScript. 
  - **CSS**: Used extremely specific selectors (`.fc-v-event .fc-event-resizer-bottom`) to force `width: 100%`, `left: 0`, and `min-width: 100%`.
  - **JavaScript**: In `handleEventDidMount`, manually injected styles into the resizer DOM element when an event becomes editable. This ensures that even if CSS is overridden by FullCalendar's internal scripts, the hit area remains 100% wide and 32px tall.
  - **Event Transparency**: Maintained `pointer-events: none` on visual indicators to ensure they never block interaction with the underlying resizer.

## System Log - 2026-05-07

### Architectural Decisions
- **Persistent Interaction Mode**: Modified the "Move/Edit" state to persist through drag and resize operations. It now requires an explicit "deselect" action (tapping the empty timeline or another event) to exit, providing a more stable and less frustrating editing experience.
- **Strict Area Roles**: Refined the card's interactive zones:
  - **Top/Middle**: Dedicated to dragging/moving.
  - **Bottom Edge**: Strictly for resizing, enforced via a larger, dedicated 20px hit area.
- **Minimalist Indicators**: Replaced the cluttered arrow and grip icons with cleaner, modern indicators: a horizontal bar at the top-middle for dragging and a subtle circle at the bottom-middle for resizing. This maintains the "aesthetic and clean" goal while being highly functional.

### Code Delta
- **`src/components/CalendarView.tsx`**:
  - Updated `handleDateClick` to clear `editableEventId` when tapping empty space.
  - Updated `handleEventClick` to clear `editableEventId` when switching to a different event.
  - Removed `setEditableEventId(null)` from `handleEventDrop` and `handleEventResize`.
  - Refined `renderEventContent` with the new bar and circle indicators, and added `pointer-events: none` to them.
- **`src/index.css`**:
  - Implemented a robust 24px bottom resizer hit area (`.fc-event-resizer-bottom`) with `z-index: 50` and `width: 100%`.
  - Disabled the top resizer to prevent accidental resizing when dragging.

### Trade-offs
- **Deselection Requirement**: Forcing the user to tap away to exit edit mode adds an extra step, but significantly improves robustness on mobile by preventing accidental exits during complex repositioning.
- **Resizer Height**: A 24px bottom resizer occupies a fair amount of the card's vertical space on short events. However, this is necessary for reliable touch interaction.
