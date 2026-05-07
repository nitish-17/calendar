# 🕒 TimeLog: Productivity & Time Tracking PWA

This project is a feature-rich, mobile-first Progressive Web Application (PWA) designed for rapid logging and reflection on time spent throughout the day. The core goal is to provide users with a comprehensive, visually appealing, and offline-first view of their activities using a detailed calendar timeline.

---

## 📐 Core Architecture Stack

The application utilizes a modern, high-performance stack optimized for mobile usability and offline capability:

*   **Framework**: React 19 + TypeScript + Vite 8
*   **Styling**: Tailwind CSS v4
*   **Calendar View**: FullCalendar 6 with `timeGridDay`/`timeGridWeek` views.
*   **State/Persistence**: Dexie.js (IndexedDB wrapper) for guaranteed offline data storage.
*   **PWA**: Vite-plugin-pwa for robust offline capability and installability.

---

## ✨ Key Features & Design Enhancements

The application has been iteratively refined to provide a clean, professional interface with a premium, "Solo Leveling" (RPG-inspired) aesthetic applied exclusively to the calendar cards:

### 🗓️ Calendar and Timeline View
*   **Enhanced View Switching**: Seamless Day/Week view toggling with optimized scaling for mobile legibility.
*   **Granular Time Precision**: Logging and manipulation operate in **15-minute increments**, with a default event duration of 15 minutes for rapid time-blocking.
*   **Dynamic Data Display**: Human-readable date headers (e.g., "Thursday, May 7th") and intelligent text wrapping for event titles to maximize visibility.
*   **Fluid Navigation**: Smooth vertical and horizontal scrolling to "Today" and the current time marker, providing immediate focus.
*   **Robust Interactivity**:
    *   **Single Tap**: Opens a custom **EventModal** for editing text and colors.
    *   **Double Tap**: Enters a dedicated **Edit/Move Mode** with stable drag-and-drop and resizing handles.
    *   **RGBA Color Picker**: Integrated `react-colorful` picker for precise event categorization with transparency support.

### 📱 User Experience & UI/UX
*   **Professional Dark Theme**: A consistent "soft dark" theme across the application ensures high contrast and legibility for the layout, modals, and navigation.
*   **Exclusive Solo Leveling Card Aesthetic**: Calendar cards are the visual centerpiece, featuring a high-tech "Solo Leveling" look with glassmorphism, multi-layered "aura" glows, and semi-transparent backgrounds for a depth-filled, immersive experience.
*   **Mobile-First Layout**: Restricted to a `max-w-md` container, ensuring a consistent mobile feel across all devices.
*   **Fixed Navigation**: A stable bottom bar positioned in a vertical flex stack to ensure controls are always accessible and never overlap content.

### 🌐 Technical Implementation & Deployment
*   **Offline Capability**: Full PWA optimization with pre-cached assets and manifest-driven installation.
*   **Optimized Build**: Implemented manual code splitting for FullCalendar and vendor dependencies, ensuring fast load times and clean deployments.
*   **Deployment**: Automated GitHub Pages deployment via `gh-pages` with dedicated path handling.

---

## ⚙️ Technical Decisions Checklist

| Feature | Status | Implementation Strategy |
| :--- | :--- | :--- |
| **Calendar Persistence** | Complete | Dexie.js / IndexedDB |
| **Aesthetic Theme** | Complete | "Solo Leveling" Card Glassmorphism + Aura Glows |
| **Interaction Model** | Complete | Single Tap (Modal) / Double Tap (Edit Mode) |
| **Time Precision** | Complete | 15-minute slot duration and default length. |
| **State Management** | Optimized | Centralized `AppContext` with modularized hooks. |
| **Build Optimization** | Complete | Manual Rollup chunking for large dependencies. |