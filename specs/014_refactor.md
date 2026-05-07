# 🏗️ Refactoring Plan: App System Refinement (014)

**Reviewer Role:** Senior Software Architect
**Goal:** To transition the application from a series of patched features into a cohesive, maintainable, and scalable system by refactoring architecture patterns, state management, and core component interactions.

## I. High-Level Objectives (The Vision)

1.  **System Cohesion:** Eliminate visual and logical seams between components (Calendar, Header, Bottom Bar).
2.  **Single Source of Truth (SSOT):** Implement a global state manager (e.g., React Context) for critical data like the currently selected date, the editing event ID, and the current view mode (Day/Week).
3.  **Separation of Concerns:** Separate:
    *   **Business Logic** (Date validation, Event creation rules, Time calculations) $\rightarrow$ Utility Hooks/Services.
    *   **Presentation Logic** (DOM rendering, Styling) $\rightarrow$ Components.
    *   **State Logic** (Managing *which* data is active) $\rightarrow$ Context/State Providers.

## II. Actionable Refactoring Checklist

The plan is broken down into measurable, isolated steps to prevent context overload.

**Phase 1: State Management Foundation**
[ ] **Action 1 (Context Setup):** Create `src/context/AppContext.tsx` to house global state for `selectedDate`, `currentView`, and `editingEventId`. Implement a provider wrapper in `App.tsx`.
[ ] **Action 2 (State Consumption):** Migrate date selection and view mode state from local component state to the global `AppContext`.
[ ] **Action 3 (Event State Normalization):** Implement logic to manage the `editingEventId` (the core event subject to modification) within the global state, ensuring all event handlers (click, double-click) first update this global state.

**Phase 2: Component Decoupling & Simplification**
[ ] **Action 4 (Business Logic Extraction):** Extract all date/time calculation logic (e.g., calculating the 1-hour lookback window for "Today") from `CalendarView.tsx` into a dedicated hook: `src/hooks/useTimeCalculations.ts`.
[ ] **Action 5 (UI/UX Cleanup):** In `CalendarView.tsx`, remove *all* hardcoded styles and props that represent "patches" (e.g., specific padding offsets, multiple hardcoded CSS overrides) and replace them with context-aware class conditional rendering.

**Phase 3: Complex Interaction Stabilization**
[ ] **Action 6 (Drag/Resize State Machine):** Refactor the click/double-click/long-press logic into a robust State Machine pattern within `CalendarView.tsx`. This state machine must dictate exclusive behavior:
    1.  Tapping empty space $\rightarrow$ Clear state.
    2.  Tapping event $\rightarrow$ Set `editingEventId` and enter "Edit Select" state.
    3.  Long pressing $\rightarrow$ Set `editingEventId` and enter "Edit/Move" state.
[ ] **Action 7 (Input Handling Abstraction):** Refactor the event creation/editing process. The current use of `prompt`/`confirm` will be replaced by an abstracted `useModal` hook, which handles the display and retrieval of input data, decoupling the input mechanism from the calendar view.

**Phase 4: Polish and Finalization**
[ ] **Action 8 (Global Component Refinement):** Final review of the `App.tsx` layout to ensure `flex-col` usage and `min-h` for the bottom bar are universally stable across all devices, regardless of calendar content height.
[ ] **Action 9 (Documentation Update):** Upon completion, update `README.md` with an explicit section documenting the new architectural patterns and state flow.

---

**Next Step:** Status: Pending Action 1. Starting with State Management Foundation.