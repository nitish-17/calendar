- currently the color presents are inside color & transparancy section and is expanded by default
- move the color presets out side of that section i.e., keep it above that section
- that section should be in collapsed state by default

## System Log

### Architectural Decisions
- **Preset Priority:** Moved color presets to be permanently visible in the EventModal. This acknowledges that most users prefer quick selection from a curated palette over granular RGBA manipulation for every event.
- **Progressive Disclosure:** Kept the detailed RGBA picker and hex preview within a collapsible section ("Custom Color & Transparency"). Setting it to collapsed by default reduces visual noise and shortens the modal on smaller screens.

### Code Delta
- `src/components/calendar/EventModal.tsx`: 
    - Updated `isColorPickerOpen` initial state to `false`.
    - Refactored JSX to hoist the `COLOR_PRESETS.map` block above the section toggle.
    - Renamed the section label to "Custom Color & Transparency" to better describe the collapsed content.

### Trade-offs
- **Modal Height:** Hoisting the presets slightly increases the minimum height of the modal, but this is offset by collapsing the picker, resulting in a net decrease in default modal height.
