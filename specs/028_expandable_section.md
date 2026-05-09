- modify the guiding principles page to make it settings page with multiple sections
- use settings/cog icon instead of book icon for that page
- this page should have collapseable sections.
- for now we have only one section i.e., guiding principles
- later when i want to add more confiration or options etc, i will add move sections.

## System Log - 2026-05-10

### Architectural Decisions
- **Settings Hierarchy:** Transitioned from a single-purpose "Guiding Principles" page to a general-purpose "Settings" page. This allows for future expansion without cluttering the bottom navigation.
- **Collapsible UI:** Implemented a `CollapsibleSection` component to manage visual density as the number of settings increases. This maintains a clean mobile interface by allowing users to focus on specific configuration areas.
- **State Consolidation:** Renamed `activePage` states from `guiding-principles` to `settings` across the codebase to reflect the new broader scope.

### Code Delta
- `src/types/app.ts` & `src/context/AppContext.tsx`: Updated `activePage` types and state handlers to support the 'settings' page.
- `src/components/layout/BottomNavigation.tsx`: Changed the mode toggle to use the `Settings` icon and label.
- `src/components/SettingsView.tsx`: New root component for the settings page. It hosts the `CollapsibleSection` component and the refactored Guiding Principles management logic.
- `src/components/CalendarView.tsx`: Updated to render `SettingsView` instead of the now-deleted `GuidingPrinciplesView`.

### Trade-offs
- **Component Granularity:** Chose to keep the `CollapsibleSection` within `SettingsView.tsx` for now as it's primarily used there, but it's designed as a reusable pattern for future parts of the app.
- **Immediate Navigation:** Navigation to Settings now defaults to the Day View when switching back to the Calendar, ensuring a consistent starting point.
- **Clean Interface:** Removed placeholder sections to maintain a high-signal environment, only showing functional settings.
