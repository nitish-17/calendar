You are a meticulous lead UI engineer. Before writing any code, we are executing a strict UI Audit and Phased Implementation workflow.

### Part 1: Strict UI-Only Audit & Exclusions

Analyze our current frontend code and UI architecture. Do NOT look at, comment on, or write business logic, backend wiring, or data state management. Focus 100% on the visual layer, layout, and UX.

### STRICT SCOPE EXCLUSION:

- The calendar cards that appear on the timeline view are already perfect.
- You are strictly PROHIBITED from changing, refactoring, or touching the appearance, layout, styles, or code of these calendar cards. Leave them exactly as they are.

Audit the rest of the current UI against our new Styling Mandate:
"The entire application must feel ultra-modern, compact, and aesthetic, optimized exclusively for mobile-only, thumb-driven use. Use a Pure AMOLED Black (#000000) background for the entire canvas. Because the backdrop is pitch black, define shapes, calendar cards, and sections using crisp, thin micro-borders instead of shadows."

Report back with: (append to this file)

1. Gaps: Where our current UI (excluding the timeline calendar cards) violates the "compact", "thumb-driven", or "AMOLED" mandate.
2. Fixes: Explicit UI/UX suggestions (e.g., changing paddings to 4px/8px, moving buttons to the bottom zone, swapping shadows for transparent white borders).

### Part 2: Proposed Roadmap Structure

At the very end of your audit report(append to this file), outline a proposed "Implementation Plan" broken down into sequential Phases. Under each Phase, provide a checklist of micro-tasks. Ensure no phase or micro-task alters the timeline calendar cards.

### Execution Rule: Wait for My Approval

Do not generate any code or implement anything yet. Stop after outputting the audit and the proposed checklist roadmap. I will review it and approve it one phase at a time.

---

## Part 1: UI Audit Report & Implementation Plan

### 1. Gaps (Violations of AMOLED/Compact/Thumb-Driven Mandate)

- **Non-AMOLED Surfaces:** Multiple components (`EventModal`, `CollapsibleSection`, `MountainSection`) currently use `bg-brand-surface` (#0a0a0a) or `bg-white/5` for backgrounds. This prevents a true "Pure AMOLED" depth where components should disappear into the pitch-black canvas.
- **Shadow Usage:** Several elements (modals, active buttons) rely on `shadow-2xl` or color-tinted shadows for depth. This conflicts with the mandate to use crisp, thin micro-borders for definition.
- **Loose Spacing:** Standard `p-4` (16px) padding is used across Settings and Modals. This feels too spacious and "web-like" for a compact, professional mobile tool.
- **Thumb Reachability:** In the `EventModal`, secondary actions (Presets, Save) are positioned at the top of textareas, and the "Duration" buttons are in the middle-top. On large mobile screens, these require a grip shift.
- **Visual Clutter:** Section headers in Settings are `text-lg font-bold`, which adds unnecessary visual weight to a "compact" interface.

### 2. Fixes (Proposed UI/UX Enhancements)

- **Pure Black Canvas:** Change all component backgrounds to `#000000`. Use `border-white/10` for section containers and `border-white/5` for internal dividers.
- **Spacing Overhaul:** Standardize on an 8px (2 units) grid for layout and 4px (1 unit) for internal grouping.
- **Shadow-to-Border Transition:** Remove all `shadow-*` classes. Use subtle `white/20` borders for active/hover states to provide focus without adding "glow" (except for the excluded timeline cards).
- **Bottom-Heavy Ergonomics:** Pin the action bar (Confirm/Cancel) in the `EventModal` to the bottom of the modal container. If possible, lower the height of the modal or use a "bottom-sheet" style behavior for easier thumb access.
- **Technical Typography:** Reduce header sizes to `text-sm font-bold uppercase tracking-wider` to match the "Quest/Solo Leveling" minimalist aesthetic without the bulk.

---

### 3. Proposed Implementation Plan

#### Phase 1: Foundation & Global Styling [COMPLETED]
- [x] Update `tailwind.config` / `@theme` to enforce `#000000` as the exclusive surface color.
- [x] Refine `MobileLayout` and `BottomNavigation` height/spacing for better safe-area handling.
- [x] Create a "micro-border" utility class for consistent use across the app.
- [x] Global removal of shadows (excluding timeline cards).

#### Phase 2: Settings View & Component Refactor [COMPLETED]
- [x] Refactor `CollapsibleSection` for compact padding (8px) and AMOLED background.
- [x] Update `MountainSection` and `ActivitySection` list items with thinner borders and tight spacing.
- [x] Adjust typography across all settings sections to be more compact and technical.
- [x] Update `DataManagement` and `GuideSection` to match the new aesthetic.

#### Phase 3: Event Modal & Interaction Layer [COMPLETED]
- [x] Redesign `EventModal` to use a pure black background with micro-borders.
- [x] Optimize the `Duration` selector for faster thumb-tapping (compact grid).
- [x] Re-position "Presets" and "Save" buttons for better ergonomics.
- [x] Update the `RgbaColorPicker` container to be more compact.

#### Phase 4: Final Polishing & Consistency Audit [COMPLETED]
- [x] Final audit of all transitions and animations (ensure they are fast/snappy).
- [x] Verify consistent border-radius (standardized on `rounded-xl`).
- [x] Ensure all scrollbars and interactive states strictly follow the AMOLED + border mandate.

---
**Status:** All Phases Complete. UI Update Successfully Implemented.
