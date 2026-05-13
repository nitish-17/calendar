> **🚀 Deployed Website:** [https://nitish-17.github.io/calendar/](https://nitish-17.github.io/calendar/)

# 🕒 TimeLog: Productivity & Time Tracking PWA

This project is a feature-rich, mobile-first Progressive Web Application (PWA) designed for rapid logging and reflection on time spent throughout the day. The core goal is to provide users with a comprehensive, visually appealing, and offline-first view of their activities using a detailed calendar timeline.

---

## 📐 Core Architecture Stack

The application utilizes a modern, high-performance stack optimized for mobile usability and offline capability:

- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4
- **Notifications**: SweetAlert2 for polished, themed alerts and toasts.
- **Calendar View**: FullCalendar 6 with `timeGridDay`/`timeGridWeek` views.
- **State/Persistence**: Dexie.js (IndexedDB wrapper) for guaranteed offline data storage.
- **PWA**: Vite-plugin-pwa for robust offline capability and installability.

---

## ✨ Key Features & Design Enhancements

The application has been iteratively refined to provide a clean, professional interface with a premium, "Solo Leveling" (RPG-inspired) aesthetic applied exclusively to the calendar cards:

### 🗓️ Calendar and Timeline View

- **Enhanced View Switching**: Seamless Day/Week view toggling with optimized scaling for mobile legibility.
- **Granular Time Precision**: Logging and manipulation operate in **15-minute increments**, with a default event duration of 15 minutes for rapid time-blocking.
- **Dynamic Data Display**: Human-readable date headers (e.g., "Thursday, May 7th") and intelligent text wrapping for event titles to maximize visibility.
- **Fluid Navigation**: Smooth vertical and horizontal scrolling to "Today" and the current time marker, providing immediate focus.
- **Robust Interactivity**:
  - **Single Tap**: Opens a custom **EventModal** with a minimal, streamlined UI for rapid logging.
  - **Double Tap**: Enters a dedicated **Edit/Move Mode** with stable drag-and-drop and resizing handles.
  - **Quick-Save Presets**: Instantly capture current effort or mountain text as a reusable preset directly from the modal.
  - **RGBA Color Picker**: Precision color selection with transparency support, tucked away in a collapsible "Custom Color & Transparency" section.
  - **Optimized Inputs**: 2-line scrollable textareas for efforts and reflections to maintain a compact mobile footprint.

### 📱 User Experience & UI/UX

- **Deep Black Theme**: A high-contrast "deep black" (`#000000`) theme across the application ensures maximum legibility and a premium OLED-ready feel.
- **Exclusive Solo Leveling Card Aesthetic**: Calendar cards are the visual centerpiece, featuring a high-tech "Solo Leveling" look with glassmorphism, multi-layered "aura" glows, and semi-transparent backgrounds.
- **Mobile-First Layout**: Restricted to a `max-w-md` container, ensuring a consistent mobile feel across all devices.
- **Mountain & Activity Management**:
  - **Mountain Items**: Define core philosophical pillars or guiding principles as simple, focused text entries.
  - **Activity Items**: Organize recurring activities (e.g., workouts, deep work sessions) with titles, durations, and colors.
  - **Intelligent Presets**: One-tap access to both **Activity** and **Mountain** presets directly within the event creation flow.
- **Fixed Navigation**: A reordered bottom bar (Settings, Week View, Day View, Navigation) ensures global controls and temporal navigation are always intuitively accessible.

### 🌐 Technical Implementation & Deployment

- **Color Selection**: High-priority access to 6 bright hue-based presets (Purple, Blue, Green, Yellow, Orange, Red) with an expanded color picker for granular control.
- **Offline Capability**: Full PWA optimization with pre-cached assets and manifest-driven installation.
- **Optimized Build**: Implemented manual code splitting for FullCalendar and vendor dependencies, ensuring fast load times and clean deployments.
- **Deployment**: Automated GitHub Pages deployment via `gh-pages` with dedicated path handling.

---

## ⚙️ Technical Decisions Checklist

| Feature                  | Status    | Implementation Strategy                          |
| :----------------------- | :-------- | :----------------------------------------------- |
| **Calendar Persistence** | Complete  | Dexie.js / IndexedDB                             |
| **Aesthetic Theme**      | Complete  | "Solo Leveling" Card Glassmorphism + Aura Glows  |
| **Notifications**        | Complete  | SweetAlert2 (Custom Dark Theme)                  |
| **Interaction Model**    | Complete  | Single Tap (Modal) / Double Tap (Edit Mode)      |
| **Time Precision**       | Complete  | 15-minute slot duration and default length.      |
| **State Management**     | Optimized | Centralized `AppContext` with modularized hooks. |
| **Build Optimization**   | Complete  | Manual Rollup chunking for large dependencies.   |
