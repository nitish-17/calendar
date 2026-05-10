- in the settings view add a new section
- show an add activity button and auto schedule buttons
- when clicked on add activity button the even modal will popup
- you will add in details and click confirm. this won't add a card on calendar, but will add a item in the section with a checkmark on the left. (show only the activity or "i will" part on the item)
- you can double click the item to make changes or delete it
- you can change the order of items by dragging and sorting them
- you can select (with the check mark on left side of itmes) items and click on auto schedule. this will add the items after the current time with 15m gap between them.
- note that items are configured using event model popup , hence will also have duration. you need to accout for that and make calculations where to place them on the timeline). also if time is 5:21 pm, don't place the first item at 5:21 or 5:22, since there is 15 min precision and place after 5:30 pm.
- only add items that fall within the current day (i.e., before eod - 12 am) don't add an item if the end time falls outside of eod i.e., 12 am)

## System Log - 2026-05-10
- Implemented Auto-Schedule feature:
    - Added `unscheduledTasks` table to Dexie database in `db.ts`.
    - Created `useUnscheduledTasks.ts` hook for managing unscheduled activities.
    - Updated `ModalState` and `AppContext` to support a `mode` ('event' | 'task') for the `EventModal`.
    - Refactored `EventModal.tsx` to handle saving/editing both calendar events and unscheduled tasks.
    - Added "Auto Schedule" section to `SettingsView.tsx`:
        - Implemented "Add Activity" button to create new tasks via `EventModal`.
        - Displayed tasks with selection checkboxes and double-click to edit.
        - Implemented native HTML5 drag-and-drop for sorting tasks.
        - Implemented "Auto Schedule" algorithm:
            - Starts after the current time with 15-minute precision.
            - Adds 15-minute gaps between tasks.
            - Uses task-specific durations.
            - Ensures all scheduled events fit within the current day (before midnight).
- Fixed lint errors in hooks and components related to asynchronous state updates in effects.

## System Log - 2026-05-10 (Part 2)
- Refined Auto-Schedule UI:
    - Added significant spacing (gap-4) and improved styling for "Add Activity" and "Auto Schedule" buttons.
    - Set the "Auto Schedule" section to be collapsed by default (`defaultOpen={false}`).
    - Implemented custom circular checkboxes with a colored fill and white tick mark when selected.
- Fixed State Synchronization:
    - Refactored `useUnscheduledTasks.ts` to use `useLiveQuery` from `dexie-react-hooks`. This ensures the task list in SettingsView updates instantly whenever a task is added, edited, or deleted, even when the changes originate from a modal.

## System Log - 2026-05-10 (Part 3)
- Simplified labels in Auto Schedule section: "Add Activity" -> "Add", "Auto Schedule" -> "Schedule".
- Adjusted alignment to a more compact horizontal layout (`flex items-center gap-3`).
