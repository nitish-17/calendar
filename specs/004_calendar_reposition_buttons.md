- place/move the day week toggle and < today > buttons below in a fixed bar

## System Log - 2026-05-07

### Architectural Decisions
- **Custom UI Controls**: Transitioned from FullCalendar's built-in header to a custom React-based navigation bar. This provides better control over the layout and allows for a more mobile-optimized touch interface.
- **API Integration**: Leveraged `useRef` to access the FullCalendar API, enabling programmatic control of navigation (`prev`, `next`, `today`) and view switching (`changeView`).
- **State Management**: Introduced local state (`currentView`) to track and highlight the active calendar view, ensuring the custom UI remains in sync with the calendar's internal state.

### Code Delta
- **`src/components/CalendarView.tsx`**: 
  - Disabled `headerToolbar`.
  - Implemented a fixed bottom bar with glassmorphism styling.
  - Added navigation buttons using `lucide-react` icons (`ChevronLeft`, `ChevronRight`).
  - Added a toggle switch for Day and Week views with active state styling.
- **`src/App.tsx`**: Updated to ensure the layout accommodates the new fixed bottom bar.

### Trade-offs
- **Custom vs. Native**: While using the FullCalendar API adds slightly more code than the built-in header, it is necessary to achieve the specific visual layout requested. The increase in complexity is offset by the improved aesthetic alignment with the project's theme.
- **View Sync**: The `currentView` state is updated manually via the custom buttons. If the calendar were to change views via other means (e.g., internal events), this state might need more robust syncing (e.g., via `viewDidMount` callback), but for now, it is sufficient for the current interaction model.
