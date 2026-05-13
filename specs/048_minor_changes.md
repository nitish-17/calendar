- in the event modal -> make the duration buttons circular.
- in the event modal -> advanced color -> below the gradient picker and sliders there is a card showing the text like rgba(x,y,z,a), which is useless. remove it.
- investigate: sometimes when after i do some interaction in settings view, i click near day button(to the right), it shows week view sometimes (which is other size i.e, left side of day button) instead of day view. is this a bug ? fix it.

## System Log: Minor UI Refinements & Navigation Fix

### 1. Event Modal Improvements
- **Circular Duration Buttons:** Transitioned from `rounded-xl` (rounded rectangles) to `rounded-full` with `aspect-square`. This aligns with the "Style Preset" circles and creates a more consistent geometric language in the modal.
- **Color Picker Cleanup:** Removed the redundant RGBA string display card. The visual preview in the "Style Preset" and the picker itself are sufficient for the target user experience.

### 2. Navigation Stability Fix
- **The Bug:** Clicking the "Day" or "Week" buttons while in the Settings view would sometimes result in the wrong view being shown when switching back to the calendar.
- **Root Cause:** In `useCalendarNavigation.ts`, the `changeView` function was guarded by a check for `calendarRef.current?.getApi()`. Since the calendar is unmounted in Settings, this check failed, preventing the `currentView` state from updating. `CalendarCore` then mounted with the stale state.
- **Resolution:** Updated `useCalendarNavigation.ts` to always call `setCurrentView(view)` regardless of the API's presence. This ensures the correct view is applied as the `initialView` when `CalendarCore` mounts.
- **UX Refactor:** Redesigned `BottomNavigation.tsx` to use a grouped layout (`Views | Navigation | Tools`) with explicit spacing and borders. This prevents hit-area overlap and provides clearer visual separation between distinct functional groups.
