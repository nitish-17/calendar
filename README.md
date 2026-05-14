# 🕒 TimeLog: Productivity & Time Tracking PWA

**🚀 Deployed Website:** [https://nitish-17.github.io/calendar/](https://nitish-17.github.io/calendar/)

---

## 🌟 Part 1: User Guide

TimeLog is a mobile-first Progressive Web Application (PWA) designed for rapid logging and reflection on how you spend your time. It combines a professional "Midnight Slate" theme with high-impact "Solo Leveling" (RPG-inspired) aesthetics for your activity logs.

### ✨ Key Features

- **Mobile-First Design**: Optimized for thumb-reachability with bottom-sheet modals and ergonomic navigation.
- **Visual Timeline**: A clear, granular view of your day and week.
- **Rapid Logging**:
  - **Single Tap**: Quickly add or view event details.
  - **Double Tap**: Enter "Edit Mode" to drag, move, or resize events.
  - **15-Minute Precision**: Default event lengths and snapping for fast scheduling.
- **Productivity Presets**: Six curated color codes for quick categorization:
  - 🟣 **Log** (Purple) | 🔵 **TBD** (Blue) | 🟢 **Easy** (Green)
  - 🟡 **Moderate** (Yellow) | 🟠 **Hard** (Orange) | 🔴 **Tough** (Red)
- **Mountains & Activities**:
  - **Mountains**: Set your long-term visions, goals, or guiding principles.
  - **Activities**: Create a library of frequent tasks or habits for quick scheduling.
- **Offline First**: Works without an internet connection. Your data stays on your device.
- **Data Portability**: Easily export your data to JSON for backups or migration.

### 🎨 Visual Aesthetic

The app uses a **Deep Midnight (#020617)** foundation with **Glassmorphism** surfaces. While the overall interface is minimalist and professional, your calendar entries feature a multi-layered "aura" glow inspired by RPG level-up cards.

---

## 🛠️ Part 2: Developer & AI Agent Reference

This section provides the technical context required to maintain and extend the application.

### 🏗️ Core Architecture Stack

- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 (Vanilla CSS preference for custom components)
- **State/Persistence**: Dexie.js (IndexedDB wrapper) for offline-first local storage.
- **Calendar Engine**: FullCalendar 6 (`timeGridDay`, `timeGridWeek`).
- **PWA**: `vite-plugin-pwa` for service worker management and installation.
- **Notifications**: SweetAlert2 with a custom dark theme.

### 📂 Directory Structure

- `src/components/calendar/`: Core calendar logic and event rendering.
- `src/hooks/`: Modularized logic for activities, events, and navigation.
- `src/services/`: Data access layers for IndexedDB.
- `src/context/`: Centralized application state.
- `specs/`: Sequential Markdown files documenting every feature and technical decision. **Always check here for historical context.**

### ⚙️ Technical Conventions

- **Time Slots**: Hardcoded to 15-minute increments (`00:15:00`).
- **Theme Overrides**: FullCalendar themes are customized in `src/index.css` via CSS variables and Tailwind `@apply`.
- **Interaction Model**: Managed via custom hooks (`useCalendarInteractions.ts`) to handle the distinction between single-tap (modal) and double-tap (edit mode).
- **Deployment**: Automated via GitHub Actions/`gh-pages` to the `dist` folder.

### 📝 Implementation Notes

- **Dynamic Headers**: The calendar header format is customized in `CalendarCore.tsx`'s `dayHeaderContent` prop. It uses a conditional "Short" vs "Long" format based on the active view (Day/Week).
- **Glassmorphism**: Defined in `src/index.css` under `.solo-glass` and `.solo-aura`. These classes are protected "visual mandates" and should not be modified without explicit instruction.

### 🚀 Getting Started

1. `npm install`
2. `npm run dev` (Development server)
3. `npm run build` (Production build)
4. `npm run lint` (Linting check)
