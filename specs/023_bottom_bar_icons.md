- for the buttons in the bottom bar, remove background and borders, just show buttons (and color if applicable)
- instead of target icon for today, show "Clock" icon.
- remove color from today icon.

## System Log - May 7, 2026

### Architectural Decisions
- **Simplified UI:** Removed container styling (backgrounds and borders) from the bottom navigation bar to achieve a more minimal, "floating icon" look.
- **Active State Indicators:** Transitioned from background-based active states to color and scale-based indicators (`text-brand-primary` and `scale-110`) for the view toggles to maintain usability without the visual weight of buttons.

### Code Delta
- **`src/components/layout/BottomNavigation.tsx`**:
    - Replaced `Target` icon with `Clock` from `lucide-react`.
    - Removed `bg-brand-surface/50`, `rounded-xl`, and `border border-glass-border` from the view toggle container.
    - Stripped all buttons of `bg-brand-primary`, `bg-brand-surface`, `border`, `shadow-lg`, and `hover:bg-white/10`.
    - Updated active view toggle styling to use `text-brand-primary scale-110`.
    - Standardized icon sizes to `w-6 h-6` (with `w-7 h-7` for chevrons to maintain visual weight).
    - Increased internal spacing (`gap-4`) and container padding (`px-6`) for a more spacious feel.
    - reset the 'Today' icon color to the default `text-gray-400` / `hover:text-gray-200`.
    - **`src/components/calendar/CalendarCore.tsx`**:
        - Wrapped `dayHeaderContent` return value in a `span` with `text-brand-primary` to apply the primary theme color to the date header.

    ### Trade-offs
- **Touch Targets:** While the visual "button" boundaries are gone, the padding (`p-2`) is maintained to ensure touch targets remain sufficiently large for mobile users.
- **Contrast:** Active states now rely solely on color and scale. This reduces visual clutter but requires the primary color to have sufficient contrast against the background.

