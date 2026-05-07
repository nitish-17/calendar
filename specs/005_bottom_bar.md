- use icons in bottom bar so that everything is visible without having to scroll horizontally.
- use flex or something so that everything feels uniformly spaced.
- change the order: put the day/week toggle on the left and < today(icon) > on the right.

## System Log - 2026-05-07

### Architectural Decisions
- **Icon-Driven Interface**: Replaced text-based buttons with icons (`Target` for Today, `Calendar` and `Columns` for View Toggles) to ensure a compact, overflow-free layout on small screens.
- **Structural Reordering**: Moved the View Toggle to the left and Navigation to the right to better align with the user's requested mental model.
- **Visual Balance**: Used `justify-between` and balanced padding to ensure the UI feels uniformly spaced and premium.

### Code Delta
- **`src/components/CalendarView.tsx`**:
  - Imported `Target` icon from `lucide-react`.
  - Updated the bottom bar JSX structure to use a two-column flex layout.
  - Simplified the Day/Week toggle to be icon-only with tooltips.
  - Replaced the "Today" text button with a `Target` icon button.

### Trade-offs
- **Discoverability**: Icon-only buttons may be slightly less discoverable than text-labeled ones, but the use of standard icons (`Chevron`, `Target`, `Calendar`) and tooltips (`title` attributes) mitigates this while significantly improving the mobile aesthetic and avoiding horizontal scrolling.
