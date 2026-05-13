- in settings view -> mountain section ; change the interface just like activity section i.e., remove the edit delete button on a preset card, tap a preset to open/edit/save/cancel/delete it.

## System Log

### Architectural Decisions
- **Unified Interaction Pattern:** Refactored the Mountain section to use a "tap-to-edit" pattern, consistent with the Activity section. This declutters the UI by removing persistent edit/delete buttons from every card.
- **Inline Editing with Full Control:** Maintained inline editing for Mountains (due to their simplicity compared to Activities) but moved the "Delete" functionality into the edit state, ensuring all management actions are accessible from a single point of interaction.

### Code Delta
- `src/components/SettingsView.tsx`:
    - Removed `Edit2` and `Trash2` buttons from the Mountain preset card.
    - Added `onClick` handler to the preset card to trigger the edit state.
    - Added a labeled "Delete" button with a `Trash2` icon within the inline edit state for clarity and consistency.

### Trade-offs
- **Discoverability:** While removing buttons can sometimes impact discoverability, the `cursor-pointer` and hover effects (`hover:bg-white/[0.07]`) are established patterns in this app (like the Activity section) that signal interactivity.
