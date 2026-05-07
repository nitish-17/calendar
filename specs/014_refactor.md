- Temporarily assume the role of a senior developer and reviewer to refactor—or reimplement if necessary—the code using software design patterns and best practices for maintainability and extensibility.

## System Log - May 7, 2026

### Architectural Decisions
- **Hook-Based Modularization:** Extracted complex calendar orchestration from `CalendarView.tsx` into specialized hooks. This follows the Single Responsibility Principle and improves testability.
- **Facade Pattern:** Implemented `useCalendar.ts` as a facade hook that aggregates sub-hooks (`useCalendarNavigation`, `useCalendarInteractions`, `useCalendarEvents`). This provides a clean, unified API for the UI layer.
- **Separation of Concerns:** 
    - `useCalendarNavigation`: Manages view state and FullCalendar navigation.
    - `useCalendarInteractions`: Handles timing-sensitive interactions (double-tap, long-press) and event CRUD logic.
    - `useCalendarEvents`: Transforms domain models into the format required by the external library (FullCalendar).
- **Type-Only Imports:** Transitioned to `import type` where appropriate to satisfy strict build requirements and improve build performance.

### Code Delta
- **New Files:**
    - `src/hooks/useCalendar.ts`
    - `src/hooks/useCalendarNavigation.ts`
    - `src/hooks/useCalendarInteractions.ts`
    - `src/hooks/useCalendarEvents.ts`
- **Modified Files:**
    - `src/components/CalendarView.tsx`: Simplified from ~150 lines to ~40 lines.
    - `src/context/AppContext.tsx`: Cleaned up unused and invalid imports.
    - `src/hooks/useEvents.ts`: Cleaned up unused imports.

### Trade-offs & Considerations
- **Prompts vs. Custom Modals:** Kept `prompt` and `confirm` for now to minimize scope, but the interaction logic is now abstracted such that swapping them for a custom Modal component would only require changes in `useCalendarInteractions.ts`.
- **Performance:** Used `useMemo` and `useCallback` extensively in the new hooks to prevent unnecessary re-renders in the complex Calendar component.
