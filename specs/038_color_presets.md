- in the event modal, in the color picker collapsible section, at the top (above the gradient color picker) add 6 presets color across hue
- show these options as color circles (just like how it might look as a card would with glow and stuff)
- preset colors must have 0.75 trasparancy for all.

## System Log

### Architectural Decisions
- **Consistency with Card Aesthetic:** Leveraged the existing `solo-glass` and `solo-aura` CSS classes to ensure the color presets visually match the calendar events. This provides a consistent "What You See Is What You Get" (WYSIWYG) experience.
- **Fixed Transparency for Presets:** Enforced a 0.75 transparency for all presets as requested, while still allowing the preview circle to use the 0.4 "glass" background for aesthetic depth.
- **Visual Feedback:** Added a `Check` icon and a scale/ring effect to the selected preset to provide clear feedback on the current color selection.

### Code Delta
- `src/components/calendar/EventModal.tsx`:
    - Defined `COLOR_PRESETS` constant with 6 colors:
        1. Purple (Primary)
        2. Blue
        3. Green
        4. Yellow
        5. Orange
        6. Red
    - Added a preset selection row at the top of the color picker section.
    - Integrated `Check` icon for the active selection.
    - Applied `solo-glass` and `solo-aura` with dynamic CSS variables for the preview circles.

### Trade-offs
- **Alpha Comparison:** The `isSelected` logic for presets ignores the alpha channel to maintain the "selected" state even if the user slightly adjusts transparency in the picker, as long as the base RGB remains the same. This is a usability trade-off to avoid the selection mark disappearing immediately upon minor alpha adjustments.
