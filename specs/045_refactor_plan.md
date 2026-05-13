# Code Audit & Refactor Plan

This document provides a detailed audit of the current codebase and proposes structural improvements to enhance robustness, performance, and extensibility.

## 1. Directory-by-Directory Audit

### `src/context` & `src/types`
*   **Observation:** `AppContextType` defines `currentView` as `'day' | 'week' | 'month'`, while the actual values used are FullCalendar's `timeGridDay` and `timeGridWeek`.
*   **Improvement:** Unify view types. Use an `enum` or a strictly typed `Union` that matches FullCalendar's internal view names to avoid mapping errors.
*   **Design Pattern:** **State Management Pattern**. Consider moving complex state transitions (like modal opening with specific initial data) into a reducer (`useReducer`) to ensure atomic state updates.

### `src/db` & `src/services`
*   **Observation:** `EventService` is used only for events. `Mountain` and `Activity` logic is scattered across hooks.
*   **Improvement:** Implement a unified **Service/Repository Layer**. Every entity (Event, Mountain, Activity) should have a dedicated service class or object to encapsulate Dexie queries.
*   **Robustness:** Add explicit error handling (try-catch) in the service layer with standardized logging or user notifications.

### `src/hooks`
*   **Observation:** Inconsistency in database integration. `useActivity` uses `useLiveQuery` (reactive), while `useMountain` uses `useState` + `useEffect` (manual fetch).
*   **Improvement:** Standardize on `useLiveQuery` for all data-fetching hooks. This ensures the UI is always in sync with IndexedDB without manual refresh calls.
*   **Logic Extraction:** `useCalendarInteractions` contains complex gesture logic (double-tap detection). This should be moved to a utility or a specialized `useGestures` hook to keep the main hook clean.

### `src/components/SettingsView.tsx`
*   **Observation:** The file is too large (~480 lines) and handles UI rendering, data import/export, drag-and-drop logic, and scheduling algorithms.
*   **Improvement:** **Component Decomposition**. Split this into:
    *   `ActivitySection.tsx`
    *   `MountainSection.tsx`
    *   `DataManagement.tsx`
    *   `GuideSection.tsx`
*   **Design Pattern:** **Strategy Pattern** for Scheduling. Move the `handleAutoSchedule` logic into a separate `AutoScheduler` service. This makes the algorithm testable in isolation and easier to swap with a more advanced one (e.g., handling conflicts or priorities).

### `src/components/calendar/EventModal.tsx`
*   **Observation:** Contains heavy UI logic for color picking, duration selection, and preset management.
*   **Improvement:** Use **Compound Components** for the layout and sections. This allows for more flexible UI adjustments without bloating the main component.
*   **Performance:** Memoize preset lists to prevent re-renders when typing in the title/description fields.

## 2. General Architectural Recommendations

### Robustness & Data Integrity
*   **Transactions:** Use `db.transaction()` for multi-step database operations like `handleAutoSchedule` to ensure atomicity.
*   **Validation:** Implement a schema validation layer (e.g., using `Zod`) for Data Import. Currently, `importInto` is called on any JSON file, which could corrupt the local state if the format is incorrect.

### Performance
*   **Re-render Optimization:** Use `React.memo` for static or heavy leaf components like `EventCard` and `CollapsibleSection`.
*   **Lazy Loading:** The FullCalendar bundle is large. Continue using Vite's manual chunks, but consider dynamic `import()` for the `SettingsView` if the initial load time becomes an issue.

### Extensibility
*   **Dependency Injection:** Pass the database instance or service objects to hooks via context or props rather than importing them directly. This makes unit testing with mocks much easier.
*   **Theme Engine:** Move hardcoded colors in `constants/calendar.ts` and Tailwind classes into a more structured theme configuration to support future "Light Mode" or custom "Solo Leveling" skins.

## 3. Implementation Roadmap (Priority Order)

1.  **Standardize Hooks:** Convert `useMountain` to use `useLiveQuery`.
2.  **Refactor SettingsView:** Decompose into sub-components.
3.  **Service Layer Expansion:** Create `ActivityService` and `MountainService`.
4.  **Scheduling Logic Extraction:** Move auto-scheduling to a dedicated service.
5.  **Schema Validation:** Add validation for JSON imports.

## 4. Detailed Execution Phases

### Phase 1: Hook Standardization & Reactive Data (COMPLETE)
*Goal: Ensure all data-fetching hooks are reactive and consistent.*
- [x] Refactor `useMountain.ts` to use `useLiveQuery` instead of manual `useState`/`useEffect` fetching.
- [x] Remove manual `fetchMountains` calls from `addMountain`, `updateMountain`, and `deleteMountain`.
- [x] Verify that `SettingsView` and `EventModal` update instantly when a mountain is added/edited without requiring manual refresh.

### Phase 2: Service Layer & Type Unification (COMPLETE)
*Goal: Encapsulate database logic and fix terminology mismatches.*
- [x] Create `src/services/mountainService.ts` and `src/services/activityService.ts`.
- [x] Move all Dexie queries from hooks into these new services (matching the `EventService` pattern).
- [x] Update `src/types/app.ts` to change `currentView` options to exactly match FullCalendar's internal names (`timeGridDay`, `timeGridWeek`).
- [x] Update `AppContext.tsx` and all consumers to use the unified view naming convention.

### Phase 3: Component Decomposition (SettingsView) (COMPLETE)
*Goal: Reduce file complexity and improve maintainability.*
- [x] Extract `ActivitySection` into its own component file.
- [x] Extract `MountainSection` into its own component file.
- [x] Extract `DataManagement` (Import/Export/Purge) into its own component file.
- [x] Extract `GuideSection` into its own component file.
- [x] Refactor `SettingsView.tsx` to be a clean orchestrator of these sections.

### Phase 4: Logic Extraction & Strategy Pattern (COMPLETE)
*Goal: Move complex algorithms out of the UI layer.*
- [x] Create `src/services/schedulingService.ts` and move the `handleAutoSchedule` logic there.
- [x] Wrap the scheduling logic in a `db.transaction()` to ensure all events are created atomically.
- [x] Create `src/hooks/useDoubleTap.ts` and move the double-tap detection logic from `useCalendarInteractions.ts`.
- [x] Pass navigation/interaction handlers as clean callbacks to `CalendarCore`.

### Phase 5: Reliability & Performance Polish (COMPLETE)
*Goal: Add final robustness layers and optimize rendering.*
- [x] Install `zod` and create a schema for the Database Export/Import format.
- [x] Add a validation step in the `handleImport` logic to prevent corrupted data from being saved.
- [x] Wrap `EventCard`, `EventModal` sections, and `CollapsibleSection` in `React.memo`.
- [x] Perform a final audit of console warnings and type safety across the refactored files.
