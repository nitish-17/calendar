- in settings view add a section for import export.
- there is an npm package which makes exporting dexie db to json file and importing it very easy
- add another section for date purge, incase i want to start from scratch

## System Log - 2026-05-10

### Architectural Decisions
- **Data Portability:** Chose `dexie-export-import` to provide a robust, JSON-based backup mechanism. This ensures users can migrate their data between devices or preserve it before making significant changes.
- **Safety First:** Implemented a "Danger Zone" pattern for the Data Purge feature, using a native browser confirmation dialog to prevent accidental data loss.
- **Progressive Disclosure:** Leveraged the existing `CollapsibleSection` component for the new "Data Management" section to keep the Settings page organized and digestible.

### Code Delta
- `src/components/SettingsView.tsx`:
    - Integrated `exportDB` and `importInto` from `dexie-export-import`.
    - Added `handleExport` to generate and download a JSON backup file.
    - Added `handleImport` to restore database state from a selected JSON file, followed by a page reload to refresh the UI.
    - Added `handlePurge` to clear all Dexie tables with user confirmation.
    - Implemented a new "Data Management" collapsible section containing Import/Export and Danger Zone subsections.

### Trade-offs
- **Full Page Reload:** Chose to use `window.location.reload()` after an import or purge to ensure all app states and hooks (like `useEvents`) are perfectly synchronized with the new database state without requiring complex manual state resets.
- **Native File Picker:** Utilized a hidden `<input type="file">` triggered by a custom button to maintain the glassmorphism aesthetic while using standard browser file selection behavior.
