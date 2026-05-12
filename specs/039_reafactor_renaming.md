- refactor: rename wherever you see "vision" to mountain (both in code and ui)
- refactor: rename wherever you see "routine" to "activity"
- after all refactoring is done, update readme.md

## System Log

### Architectural Decisions
- **Brand Evolution:** Shifted from "Vision" and "Routine" to "Mountain" and "Activity". The term "Mountain" provides a more distinctive and evocative metaphor for long-term goals and philosophical pillars, while "Activity" aligns more naturally with the core logging functionality of the app.
- **Data Layer Migration:** Incremented the database version to 5 to handle the renaming of tables (`visions` -> `mountains`, `routines` -> `activities`). This maintains a clean and accurate mapping between the application's vocabulary and its persistence layer.

### Code Delta
- `src/db/db.ts`: Renamed `Vision` to `Mountain`. Renamed `visions` table to `mountains` and `routines` to `activities`. Incremented version to 5.
- `src/hooks/useMountain.ts`: New hook replacing `useVision.ts`.
- `src/hooks/useActivity.ts`: New hook replacing `useRoutine.ts`.
- `src/utils/mountainParser.ts`: New utility replacing `visionParser.ts`.
- `src/components/SettingsView.tsx`: Updated all UI labels, variable names, and hook imports. "Vision" is now "Mountain", and "Routine" is now "Activity".
- `src/components/calendar/EventModal.tsx`: Updated labels ("vision" -> "mountain"), placeholders, and hook usage. Renamed "New/Edit Activity" to "New/Edit Effort" to distinguish between logged instances and preset activities.
- `README.md`: Updated "Vision & Routine Management" to "Mountain & Activity Management".

### Trade-offs
- **Breaking Change for Local Data:** Renaming database tables at v5 is a breaking change for local IndexedDB data. This path was chosen to prioritize a clean, professional codebase with zero terminology debt, acknowledging that early-stage users may need to re-import their data or backup/restore.
- **Effort vs. Activity:** In the `EventModal`, I used "Effort" for the logging titles and "Activity" for the preset section. This helps differentiate between the *act* of doing something (Effort) and the *type* of thing being done (Activity).
