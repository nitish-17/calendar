- add a new page in the app
- to access this page we add an icon in the bottom bar
- this page is about managing presets for guiding principle
- here we can add, edit, delete guiding principles
- each guiding priciple must have a label and text
- label is for dropdown as text can be long for dropdowns
- show a dropdown below the guiding principles input field in the event modal that shows lables defined in guiding principle section
- if we select any option(label), the guiding principle field in the event modal should get populated with text
- the idea is to make adding and managing guiding principle easier.

## System Log - 2026-05-10

### Architectural Decisions
- **Page Management:** Integrated a new `activePage` state into `AppContext` to handle top-level navigation between the Calendar and the new Guiding Principles management page.
- **Data Persistence:** Added a `guidingPrinciples` table to Dexie (v2) to store presets with `label` and `text` fields.
- **Navigation UX:** Updated the `BottomNavigation` bar with a dedicated `BookOpen` icon. Navigation controls (Today, Prev, Next) are contextually hidden when in Presets mode to maintain focus.
- **Modal Integration:** Added a `useGuidingPrinciples` hook to fetch presets and integrated a dropdown into `EventModal`. This allows users to quickly populate the "Guiding Principle" field from their saved presets.

### Code Delta
- `src/db/db.ts`: Defined `GuidingPrinciple` interface and updated `MyDatabase` schema (version 2).
- `src/types/app.ts`: Added `activePage` and `setActivePage` to `AppContextType`.
- `src/context/AppContext.tsx`: Implemented `activePage` state management.
- `src/hooks/useGuidingPrinciples.ts`: New hook for CRUD operations on presets.
- `src/components/GuidingPrinciplesView.tsx`: New component for managing presets with an intuitive glassmorphism UI.
- `src/components/layout/BottomNavigation.tsx`: Updated to support page switching and contextual control visibility.
- `src/components/CalendarView.tsx`: Implemented conditional rendering of the active page.
- `src/components/calendar/EventModal.tsx`: Integrated the preset selection dropdown.

### Trade-offs
- **Navigation Simplicity:** Chose a simple state-based "page" switch instead of a full routing library (like React Router) to keep the bundle size small and the application logic straightforward for this PWA.
- **Dropdown UI:** Used a native `select` element within a styled container for the presets dropdown to ensure maximum mobile accessibility and performance while maintaining a themed appearance.
- **Mobile Accessibility:** Made Edit and Delete buttons in the Guiding Principles list permanently visible (removed hover dependency) and increased touch target size for mobile users.

## System Log - 2026-05-10 (B)

### Bug Fix: Week View Compression
- **Issue:** Switching to Week View for the first time resulted in a compressed layout (all 7 days fitting in screen width). Clicking "Week" a second time fixed it.
- **Root Cause:** A race condition existed between the CSS `transition-all` on the calendar container and FullCalendar's internal view calculation. FullCalendar was calculating the 7-day layout while the container was still transitioning from 100% width, leading to the compressed look.
- **Fix:**
    - Removed `transition-all duration-300` from `CalendarCore.tsx` to ensure the container width snaps to its correct size (`250%`) immediately.
    - Updated `useCalendarNavigation.ts` to use `requestAnimationFrame` when calling `changeView`, ensuring the DOM width state is applied before FullCalendar renders the new view.
    - Refactored `useCalendar.ts` to re-trigger `updateSize()` whenever `currentView` changes, ensuring perfect synchronization.

## System Log - 2026-05-10 (C)

### Configuration Update: Week Start Day
- **Change:** Set Monday as the first day of the week for the calendar views.
- **Implementation:** Added `firstDay={1}` to the `FullCalendar` component in `src/components/calendar/CalendarCore.tsx`. This ensures that the week view starts on Monday instead of the default Sunday.
