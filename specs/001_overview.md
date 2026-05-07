- We are building a mobile-only PWA productivity app designed primarily for rapid logging on a calendar.
- The user's intent is to gain awareness of how they spend their time and to reflect on previous days.
- Therefore, we need a calendar/timeline view with date navigation and local persistence.
- The core architecture will include React + Vite, Progressive Web App (PWA) capabilities for offline access, the FullCalendar library, and Dexie.js.
- This information is provided to establish the project scaffold.

## System Log - 2026-05-07

### Architectural Decisions

- **Framework**: React + Vite (TypeScript) for a high-performance, modern development experience.
- **Persistence**: **Dexie.js** for a robust, promise-based wrapper around IndexedDB, ensuring reliable local data storage for offline use.
- **UI/Calendar**: **FullCalendar** with the `timeGridDay` plugin to provide a detailed, scrollable timeline view optimized for mobile logging.
- **Styling**: **Tailwind CSS v4** utilizing the `@tailwindcss/vite` plugin. This allows for modern CSS features and efficient theme management using CSS variables.
- **PWA**: **vite-plugin-pwa** configured for automatic service worker updates and offline manifest generation.

### Code Delta

- **Initialization**: Scaffolded Vite React-TS project.
- **Database (`src/db/db.ts`)**: Established `MyDatabase` class with an `events` store.
- **Components**:
  - `CalendarView.tsx`: Core integration of FullCalendar with interactive event creation (via prompt) and deletion.
  - `App.tsx`: Established a mobile-constrained container with glassmorphism header and navigation.
- **Styling**: `index.css` configured with a custom dark theme (`#121212`) and glassmorphism utility classes.

### Trade-offs

- **Styling**: Chose Tailwind v4 for its near-zero runtime and CSS-first approach, requiring less configuration than v3 but utilizing newer Vite plugin integration.
- **Interactions**: Initial event logging uses native `prompt` and `confirm` for rapid prototyping; these will be replaced with custom glassmorphism modals in future iterations.
- **Layout**: Forced a `max-w-md` container even on desktop to maintain the mobile-only feel and ensure design consistency across devices.
