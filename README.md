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
- **Fluid Navigation**: Smooth vertical and horizontal scrolling to "Today" and the current time marker, providing immediate focus.
- **Ergonomic Interactivity**:
  - **Single Tap**: Opens a redesigned **EventModal** featuring a bottom-sheet layout for superior thumb reachability.
  - **Double Tap**: Enters a dedicated **Edit/Move Mode** with stable drag-and-drop and resizing handles.
  - **Compact Controls**: A 4-column duration grid and re-positioned "Presets/Save" buttons optimized for rapid logging.
  - **RGBA Color Picker**: Precision color selection tucked away in a compact, collapsible "Advanced Color" section.

### 📱 User Experience & UI/UX

- **Pure AMOLED Black Theme**: A strict `#000000` canvas across the application ensures zero light bleed on OLED screens and a premium, high-contrast feel.
- **Micro-Border Definition**: Shapes and sections are defined by crisp, thin **micro-borders** instead of shadows, creating an ultra-modern, technical aesthetic.
- **Compact "Quest" Typography**: Minimalist, bold uppercase headers and technical font sizing match a "Solo Leveling" (RPG) UI style without the bulk.
- **Solo Leveling Card Aesthetic**: While the UI is minimalist, calendar cards remain the visual centerpiece with glassmorphism, multi-layered "aura" glows, and semi-transparent backgrounds.
- **Thumb-Driven Layout**: Optimized for mobile-only use with a restricted `max-w-md` container and an 8px/4px spacing grid.
- **Reordered Navigation**: A high-touch bottom bar featuring multi-line buttons for Week/Day views, large temporal navigation controls, and a dedicated "Tools" (Settings) portal.

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
| **UI Architecture**      | AMOLED    | Pure Black (#000000) + Micro-Border System       |
| **Ergonomics**           | Optimized | Thumb-driven Bottom Sheets & Navigation          |
| **Aesthetic Theme**      | Complete  | Technical "Quest" Style + Solo Leveling Cards    |
| **Notifications**        | Complete  | SweetAlert2 (Custom Dark Theme)                  |
| **Interaction Model**    | Complete  | Single Tap (Modal) / Double Tap (Edit Mode)      |
| **Time Precision**       | Complete  | 15-minute slot duration and default length.      |
| **State Management**     | Optimized | Centralized `AppContext` with modularized hooks. |
| **Build Optimization**   | Complete  | Manual Rollup chunking for large dependencies.   |
