### STRICT SCOPE EXCLUSION:

- The calendar cards that appear on the timeline view are already perfect.
- You are strictly PROHIBITED from changing, refactoring, or touching the appearance, layout, styles, or code of these calendar cards. Leave them exactly as they are.

---

## UI Re-implementation Audit & Plan

### 1. The Vision: "Deep Midnight & Slate"
Move away from the high-contrast AMOLED black to a soft, professional dark theme using a palette of Deep Slate and Zinc. The goal is "visual comfort"—reducing eye strain while maintaining a premium, modern feel.

- **Background:** Deep Slate (`#020617` / `slate-950`).
- **Surface:** Muted Zinc (`#18181b` / `zinc-900`) with subtle translucency.
- **Accents:** Indigo and Violet for primary actions; Amber/Emerald for secondary states.
- **Typography:** Return to balanced mobile typography. Content should be `13px-14px`, headers `16px-18px`.
- **Definition:** Use soft "inner glows" and subtle borders instead of harsh white lines.

### 2. Implementation Roadmap

#### Phase 1: Foundation & Global Design System [COMPLETED]
- [x] Update `index.css` with new color variables and global background.
- [x] Define standard "Surface" and "Card" utility classes.
- [x] Reset global typography defaults.

#### Phase 2: Shell & Navigation [COMPLETED]
- [x] Refactor `MobileLayout` for softer transitions.
- [x] Redesign `BottomNavigation`: Replace the blocky look with a floating or more integrated frosted-glass effect.
- [x] Update navigation icon scaling and active states.

#### Phase 3: Settings & Content Sections [COMPLETED]
- [x] Refactor `CollapsibleSection`: Use soft backgrounds and better vertical spacing.
- [x] Redesign `ActivitySection` and `MountainSection` list items: Move away from "Quest" style to a clean, "Apple Health/Reminders" inspired list layout.
- [x] Fix the aggressive font sizes in `GuideSection` and `DataManagement`.

#### Phase 4: Event Modal & Input Layer [COMPLETED]
- [x] Redesign `EventModal`: Transition to a true "Bottom Sheet" feel with soft rounded corners and a more ergonomic layout.
- [x] Refactor Input Fields: Use floating labels or better-defined input containers with focus rings.
- [x] Redesign Buttons: Use solid colors with subtle gradients/shadows instead of thin borders.

#### Phase 5: Final Polish & Interactions [COMPLETED]
- [x] Add subtle haptic-like animations (springs/scales) to buttons.
- [x] Standardize empty states and loading indicators.
- [x] Final audit for consistency across all views.

