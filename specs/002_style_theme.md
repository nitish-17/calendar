- The entire application should feel modern, clean, user-friendly, and aesthetic, while remaining highly functional.
- Use a dark theme that is easy on the eyes rather than pitch black.
- For specific elements like calendar cards and energy bars, incorporate glassmorphism and subtle glow effects.

## System Log - 2026-05-07

### Architectural Decisions
- **Color Palette**: Defined a "soft dark" theme using `#121212` for the background and `#1e1e1e` for surfaces. This provides depth without the harshness of pure black, aligning with the "easy on the eyes" requirement.
- **Visual Effects**: 
  - **Glassmorphism**: Implemented via a `.glass` utility class using `backdrop-blur-md`, semi-transparent white backgrounds (`rgba(255, 255, 255, 0.05)`), and subtle borders.
  - **Glow**: Added a `.glow` utility using a soft purple box-shadow (`rgba(168, 85, 247, 0.2)`) to highlight key interactive elements.
- **Typography**: Selected a clean sans-serif stack (Inter/system-ui) for high readability and a modern feel.

### Code Delta
- **`src/index.css`**: Configured Tailwind v4 `@theme` block with custom brand variables (`--color-brand-bg`, `--color-brand-surface`, etc.) and utility layers for `.glass` and `.glow`.
- **`src/App.tsx`**: Applied glassmorphism to the header and bottom navigation to create a layered, modern depth.
- **`src/components/CalendarView.tsx`**: Wrapped the FullCalendar instance in a glassmorphic container with a glow effect.

### Trade-offs
- **FullCalendar Customization**: FullCalendar uses its own internal CSS variables. I've begun overriding these to match the brand theme, but deeper integration (e.g., custom event renderers) is deferred until specific card designs are required.
- **Interactive Feedback**: Current feedback for actions (like event creation) relies on native browser dialogs. While functional, these deviate from the aesthetic goal and are earmarked for replacement with custom UI components.
