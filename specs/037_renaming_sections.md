- refactor: rename wherever you see "guiding principle" or "notes" to vision. (both in code and ui)
- refactor: rename wherever you see "habits" to "routine"
- after all refactoring is done, update readme.md

## System Log

### Architectural Decisions
- **Unified Branding:** Transitioned from technical or generic terms ("Guiding Principles", "Notes", "Habits") to more aspirational and cohesive terms ("Vision", "Routine"). This aligns with the application's focus on productivity and long-term goals.
- **Database Schema Migration:** Incremented the Dexie database version to 4 to reflect the renaming of `guidingPrinciples` to `visions` and `unscheduledTasks` to `routines`. This ensures a clean break and consistent naming at the data layer.
- **Hook & Utility Synchronization:** Renamed hooks (`useVision`, `useRoutine`) and utilities (`visionParser`) to maintain a clear 1:1 mapping between the UI terminology and the underlying code structure.

### Code Delta
- `src/db/db.ts`: Renamed `GuidingPrinciple` to `Vision`. Renamed `guidingPrinciples` table to `visions` and `unscheduledTasks` to `routines`. Incremented version to 4.
- `src/hooks/useVision.ts`: New hook replacing `useGuidingPrinciples.ts`.
- `src/hooks/useRoutine.ts`: New hook replacing `useUnscheduledTasks.ts`.
- `src/utils/visionParser.ts`: New utility replacing `principleParser.ts`.
- `src/components/SettingsView.tsx`: Updated all UI labels, variable names, and hook imports. "Habits" is now "Routine", and "Notes" is now "Vision".
- `src/components/calendar/EventModal.tsx`: Updated labels ("note" -> "vision"), placeholders ("Notes..." -> "Vision..."), and hook usage.
- `README.md`: Updated "Notes & Habit Management" to "Vision & Routine Management".

### Trade-offs
- **Breaking Change for Local Data:** Renaming database tables is a breaking change for existing local data unless a complex migration is written. Given the early stage of the project, a simple version bump was chosen to reset the tables, prioritizing code cleanliness and consistency.
- **Internal Naming vs. Public Labels:** Chose to rename both internal variables and public labels to avoid "terminology debt," where the code uses one name and the UI uses another. This increases the initial refactoring effort but reduces future cognitive load.
