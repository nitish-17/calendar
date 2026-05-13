- currently, we can save preset for activity and mountain in settings view
- it would be ideal if we could save preset directly from event modal.
- just beside preset buttons (for both activity and mountain) show "save preset" button
- when you click save preset , it gets saved (i.e, appears in settings view in their respective sections and also appears when we click presets button in event modal.)

## System Log

### Architectural Decisions
- **Contextual Saving:** Empowered users to create presets directly from the `EventModal`, reducing context switching between the calendar and settings view.
- **Unified Logic:** Leveraged existing `addActivity` and `addMountain` hooks within the `EventModal` to ensure data consistency.
- **Visual Feedback:** Integrated the `notify` utility to provide immediate confirmation when a preset is successfully captured.

### Code Delta
- `src/components/calendar/EventModal.tsx`:
    - Imported `Save` icon and `notify` utility.
    - Updated `useMountain` destructuring to include `addMountain`.
    - Implemented `handleSaveActivityPreset` and `handleSaveMountainPreset` with validation and feedback.
    - Wrapped "Presets" and "Save" buttons in a flex container for better alignment.

### Trade-offs
- **UI Density:** Adding another button to the field headers slightly increases visual complexity, but the utility of quick-saving highly outweighs the minimal cost of an extra icon.
- **Preset Meta-data:** Activity presets saved this way capture the current duration and color automatically, which is a significant usability improvement over the manual entry in settings.
