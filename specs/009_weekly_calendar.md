- make weekly calendar wider by 50 % so that the text on calendar cards is visible.
- enable horizontal scroll to be able to view all days of the week.
  update:
- i am having to click on week icon twice. when i click first time, it fits all days of the week in the view. when i click it second time, it expands and shows correctly (150% of container).

## System Log - 2026-05-07

### Architectural Decisions

- **Responsive Sizing**: Implemented a conditional width strategy for the `timeGridWeek` view. By setting the calendar's width to `150%` of its container when in weekly mode, each day column receives significantly more horizontal space, allowing event titles and details to remain legible.
- **Horizontal Overflow Management**: Wrapped the calendar in a container with `overflow-x-auto`. This allows the user to pan across the week while keeping the overall app layout stable and mobile-friendly.
- **Visual Transitions**: Added a `transition-all` class to the calendar wrapper to ensure that switching between the 100% wide Day view and the 150% wide Week view is smooth and animated.

### Code Delta

- **`src/components/CalendarView.tsx`**:
  - Added a conditional `width: 150%` style and `overflow-x-auto` class to the calendar wrapper based on the `currentView` state.
  - Wrapped the calendar in an extra `overflow-hidden` div to prevent layout breakage during the width transition.
- **`src/index.css`**: Added custom scrollbar styling for the horizontal scroller to maintain a premium aesthetic that doesn't obstruct the UI.

### Trade-offs

- **Complexity of View Switching**: Managing width manually outside of FullCalendar's internal layout requires careful handling of the container's overflow properties. However, this approach is more flexible than trying to force FullCalendar's internal table to exceed its parent's width via its own settings.
- **Scrolling UX**: On mobile, horizontal panning is a natural gesture. On desktop, users will see a slim, themed scrollbar at the bottom of the calendar view.

### Update - 2026-05-07 (Double-Click Fix)
- **Problem**: Switching to the weekly view required two clicks for the 150% expansion to take effect. This happened because FullCalendar calculated its internal layout based on the 100% width it saw at the start of the view change.
- **Solution**: Implemented a **ResizeObserver** on the calendar's container. This ensures that `calendarApi.updateSize()` is called continuously during the 300ms width transition, forcing FullCalendar to adapt its layout to the expanding space in real-time. This fix ensures the weekly view expands correctly on the very first click.
