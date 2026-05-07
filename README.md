# 🕒 TimeLog: Productivity & Time Tracking PWA

This project is a feature-rich, mobile-first Progressive Web Application (PWA) designed for rapid logging and reflection on time spent throughout the day. The core goal is to provide users with a comprehensive, visually appealing, and offline-first view of their activities using a detailed calendar timeline.

---

## 📐 Core Architecture Stack

The application utilizes a modern, high-performance stack optimized for mobile usability and offline capability:

*   **Framework**: React + TypeScript + Vite
*   **Styling**: Tailwind CSS v4 (Tailwind CSS Utility-First Design)
*   **Calendar View**: FullCalendar with `timeGridDay`/`timeGridWeek` views.
*   **State/Persistence**: Dexie.js (IndexedDB wrapper) for guaranteed offline data storage.
*   **PWA**: Vite-plugin-pwa for robust offline capability and installability.

---

## ✨ Key Features & Design Enhancements

The application has been iteratively refined through several specialization passes, resulting in the following core capabilities:

### 🗓️ Calendar and Timeline View
*   **Enhanced View Switching**: Features seamless Day/Week view toggling between 100% (Day) and 150% (Week) optimized scaling, allowing ample space for legible time-specific event titles.
*   **Granular Time Precision**: Logging, resizing, and moving events operate in **15-minute increments**, providing detailed time tracking accuracy.
*   **Visual Context**: The timeline clock markers are optimized to show only hourly intervals, decluttering the interface while maintaining 15-minute interaction precision.
*   **Fluid Navigation**: The "Today" button now includes a smooth, context-aware scroll to the current time line, providing immediate focus upon navigation.
*   **Robust Interactivity**: Implemented a highly stable **Edit/Move Mode**.
    *   **Event Interaction**: Events must be single-tapped to edit text, and double-tapped to enter the edit/move state.
    *   **Robust Manipulation**: The Edit/Move mode persists until the user taps away from the timeline, providing a reliable editing experience.
    *   **Dedicated Resizing**: Resizing is restricted to a dedicated, stable bottom hit-area, while dragging is controlled by the middle section, eliminating unpredictable behavior.

### 📱 User Experience & UI/UX
*   **Mobile-First Layout**: The core layout is restricted to a `max-w-md` container, ensuring a consistent, mobile-like feel regardless of the viewing device.
*   **Modern Aesthetics**: The entire application utilizes a "soft dark" theme, implementing **glassmorphism** and subtle glow effects on headers and cards for a premium, depth-filled look.
*   **Fixed Bottom Navigation**: The bottom bar is now correctly positioned in a vertical flex stack beneath the calendar, preventing the common issue of content overlapping or hiding behind the navigation controls.
*   **Seamless Scrolling**: Horizontal scrolling within the week view is managed with native CSS smooth scrolling for a highly fluid user experience.

### 🌐 Technical Implementation & Deployment
*   **Offline Capability (PWA)**: The app is fully optimized as a PWA, precaching all core assets and defining a comprehensive manifest for reliable offline use and mobile installation prompts.
*   **Deployment**: Configured for deployment on GitHub Pages using a dedicated `/calendar/` base path, simplifying continuous deployment workflows.

---

## ⚙️ Technical Decisions Checklist

| Feature | Status | Implementation Strategy |
| :--- | :--- | :--- |
| **Calendar Persistence** | Complete | Dexie.js / IndexedDB |
| **Layout Stability** | Fixed | Flexbox `flex-col` root container; `min-h` on bottom bar. |
| **Time Precision** | Controlled | `slotDuration="00:15:00"` in FullCalendar props. |
| **Theming** | Applied | Glassmorphism utilities (`.glass` class) and soft dark palette in `index.css`. |
| **Navigation** | Enhanced | Custom React components replacing native FullCalendar headers. |
| **State Management** | Optimized | Context/Props for cross-component state sharing (e.g., `editableEventId`). |