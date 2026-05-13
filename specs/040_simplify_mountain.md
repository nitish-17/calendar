- Currently in settings view -> mountain section accepts label and text (title and mountain) for entry.
- we don't need title, so we can remove it, just mountain is enough for entry
- we also don't require bulk edit/bulk add. so remove that button, and code for bulk add mountain

## System Log

### Architectural Decisions
- **Simplified Data Model:** Removed the `label` field from the Mountain entity. Feedback indicated that a single text field is sufficient and reduces friction for entry.
- **UI Streamlining:** Removed the "Bulk Import" and "Bulk Add" features for Mountains. The primary interaction is now focused on individual, thoughtful entries directly in the settings view.
- **Schema Migration:** Incremented the database version to 6 to reflect the removal of the indexed `label` field in the `mountains` table.

### Code Delta
- `src/db/db.ts`: Updated `Mountain` interface and incremented database version to 6.
- `src/hooks/useMountain.ts`: Removed `bulkAddMountains` logic.
- `src/components/SettingsView.tsx`: Removed label states, bulk import logic, and updated the Mountain section UI to be single-field focused.
- `src/components/calendar/EventModal.tsx`: Updated the Mountain presets list to show only the mountain text.
- `src/utils/mountainParser.ts`: Deleted as it was only used for bulk import.

### Trade-offs
- **Migration Path:** Users with existing Mountain data will see their `label` fields ignored by the UI. The data remains in IndexedDB but is no longer exposed or required.
- **Less Bulk, More Intent:** Removing bulk import might slightly increase the time to set up many principles at once, but it aligns with the application's goal of deliberate, focused logging and reflection.
