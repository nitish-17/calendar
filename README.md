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

- **Default Day View**: The application now prioritizes the immediate context by defaulting to the **Day View** on every load and refresh.
- **Enhanced View Switching**: Seamless Day/Week view toggling with optimized scaling for mobile legibility.
- **Granular Time Precision**: Logging and manipulation operate in **15-minute increments**, with a default event duration of 15 minutes for rapid time-blocking.
- **Fluid Navigation**: Smooth vertical and horizontal scrolling to "Today" and the current time marker, providing immediate focus.
- **Ergonomic Interactivity**:
  - **Single Tap**: Opens a redesigned **EventModal** featuring a bottom-sheet layout for superior thumb reachability.
  - **Semantic Color Presets**: Six curated color codes with explicit productivity meanings: **Log** (Purple), **TBD** (Blue), **Easy** (Green), **Moderate** (Yellow), **Hard** (Orange), and **Tough** (Red).
  - **Double Tap**: Enters a dedicated **Edit/Move Mode** with stable drag-and-drop and resizing handles.
  - **Compact Controls**: A 4-column duration grid and re-positioned "Presets/Save" buttons optimized for rapid logging.
  - **RGBA Color Picker**: Precision color selection tucked away in a compact, collapsible "Advanced Color" section.

### 📱 User Experience & UI/UX

- **Deep Midnight & Slate Theme**: Transitioned from harsh black to a sophisticated **Slate 950 (`#020617`)** foundation, offering superior visual comfort while maintaining a premium, high-contrast feel.
- **Refined Glass & Surface System**: Sections and containers utilize a **layered glassmorphism** approach with `backdrop-blur-md` and subtle `white/5` borders, creating depth without visual clutter.
- **Balanced Modern Typography**: Replaced the "Quest" style with a clean, legible **Inter-based** typographic system. Headers and body text are balanced for mobile readability (`13px-18px` range).
- **Solo Leveling Card Aesthetic**: While the shell is minimalist and professional, calendar cards remain the visual centerpiece with multi-layered "aura" glows and semi-transparent backgrounds, preserved for their high-impact RPG style.
- **Ergonomic Bottom Sheets**: All primary interactions, including event creation and settings, utilize a **refined bottom-sheet model** with soft rounded corners and thumb-optimized hit areas.

### 🏔️ Core Management & Portability

- **Mountain & Activity Management**:
  - **Mountain Items**: Define your purpose. Adding a Mountain is like setting a **goal, vision, or guiding principle**.
  - **Activity Items**: Prepare for action. Adding an Activity is like creating a **todo or a habit** for later scheduling.
  - **Refined List Layout**: Activity and Mountain lists feature a clean, **Apple Health-inspired** design with clear indicators and smooth interactions.
- **Data Portability**: Robust Import/Export functionality via JSON, allowing users to backup their local-first IndexedDB data or migrate it between devices.
- **Integrated Navigation**: A frosted-glass bottom bar with multi-line buttons and large temporal navigation controls, seamlessly integrated into the midnight theme.

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
| **UI Architecture**      | Midnight  | Deep Slate (#020617) + Glass/Surface System      |
| **Ergonomics**           | Optimized | Thumb-driven Bottom Sheets & Navigation          |
| **Aesthetic Theme**      | Modern    | Midnight Slate + Solo Leveling Cards             |
| **Notifications**        | Complete  | SweetAlert2 (Custom Dark Theme)                  |
| **Interaction Model**    | Complete  | Single Tap (Modal) / Double Tap (Edit Mode)      |
| **Time Precision**       | Complete  | 15-minute slot duration and default length.      |
| **State Management**     | Optimized | Centralized `AppContext` with modularized hooks. |
| **Build Optimization**   | Complete  | Manual Rollup chunking for large dependencies.   |
