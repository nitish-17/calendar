- for adding, editing, etc transition from prompt() to a minimal, Modal/Dialog.
- first make these changes:
  - long press on card or timeline should do nothing
  - double tap on the timeline (not on card) should do nothing
  - double tap a card to put it in edit/move mode
  - tap on timeline or a card to show the Modal/Dialog for editing text, changing color, deleting card.
- Modal/Dialog should have following features:
  - input filed to edit text
  - input field to edit color (show the chrome color picker with transparancy)
  - button to delete card
  - save/confirm button
  - cancel button (to close the Modal/Dialog)

## System Log - 2026-05-07

### Architectural Decisions
- **Modal State Management:** Introduced a centralized `modalState` in `AppContext` to control the Dialogue/Modal. This allows any component to trigger the modal and ensures consistent data handling for both adding and editing events.
- **Decoupling Hooks and Context:** To comply with Fast Refresh linting rules and improve maintainability, the `useAppContext` hook and the `AppContext` object were moved to separate files (`src/hooks/useAppContext.ts` and `src/context/context.ts`).
- **Conditional Modal Rendering:** The `EventModal` is conditionally rendered in `CalendarView.tsx` only when `modalState.isOpen` is true. This simplifies state initialization within the modal and improves performance.
- **Interaction Refactoring:** Transitioned from native `prompt()` and `confirm()` to the custom `EventModal`. Refined tap logic to distinguish between single tap (open modal) and double tap (edit/move mode) on event cards, while disabling long press and double tap on the timeline as requested.

### Code Delta
- **New Components:** `src/components/calendar/EventModal.tsx` - A glassmorphism-styled modal for event management.
- **New Types:** `src/types/app.ts` - Unified type definitions for application state.
- **New Hooks:** `src/hooks/useAppContext.ts` - Isolated hook for context consumption.
- **Modified Hooks:** `src/hooks/useCalendarInteractions.ts` - Updated with new interaction requirements and modal triggers.
- **Modified Context:** `src/context/AppContext.tsx` - Refactored to provide modal state and adhere to linting standards.
- **Type Safety Improvements:** Replaced numerous `any` types with specific FullCalendar types (`DateClickArg`, `EventClickArg`, etc.) across multiple files.

### Trade-offs
- **Native vs. Library Color Picker:** Chose a "minimal" custom color picker using `<input type="color">` and a range slider for opacity instead of adding a heavy external library. This fulfills the "chrome color picker with transparency" requirement while keeping the bundle size small.
- **Double Tap Threshold:** Retained the existing `CALENDAR_CONFIG.DOUBLE_TAP_THRESHOLD_MS` to ensure consistency with the app's previous interaction feel.

### Update - 2026-05-07 (Part 2)
- **Full Card Coloring**: Refactored `EventCard.tsx` to apply the event's color (including transparency) to the entire card background. This provides a much stronger visual link between the event and its category/color.
- **Advanced Color Picker**: Integrated the `react-colorful` library. Replaced the manual hex input and opacity slider with a unified `RgbaColorPicker`.
- **UI Consistency**: Styled the new color picker to match the application's dark theme and glassmorphism aesthetic.

### Update - 2026-05-07 (Part 3)
- **Removal of Glassmorphism**: Removed all `backdrop-filter: blur()` effects from the application, including event cards, the calendar container, and the navigation footer. The UI now favors a cleaner, semi-transparent style without the glass blur effect.
- **Solid Layout Components**: Transitioned the modal overlay and navigation footer to solid or simple semi-transparent backgrounds to maintain a consistent non-glassmorphic look.

### Update - 2026-05-07 (Part 4)
- **Restoration of Solo Leveling Aesthetic**: Re-implemented the "Solo Leveling" look based on `specs/015` and `previously_used.md`.
- **Blur & Glass Effects**: Restored `backdrop-filter: blur()` to event cards, modals, and the navigation footer.
- **Recipe Refinement**: 
    - Event cards now use a dynamic 40% (0.4) opacity background to maximize the glassmorphism effect.
    - Default brand color reset to Solo Leveling Blue (`#0ba5e9`).
    - Maintained 0.75 default alpha for newly created events in the modal to ensure high visibility while preserving depth.

### Update - 2026-05-07 (Part 5)
- **Theme Color Restoration**: Reverted the primary brand color from Solo Leveling Blue (`#0ba5e9`) back to the original Violet (`#a855f7`) across the entire application.
- **Visual Integrity**: Maintained all glassmorphism, blur, and glow logic while applying it to the restored violet palette.
