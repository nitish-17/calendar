# Solo Leveling: The Calendar Card Aesthetic

This document extracts the "secret" styling responsible for the immersive, glass-like, and glowing "Solo Leveling" look of the calendar cards in the Timebox Mobile project.

## 1. The Core Color Palette
The aesthetic relies on high-contrast neon accents against deep, dark backgrounds.

```css
:root {
  --accent: #0ba5e9;       /* System Blue (The primary aura) */
  --reward: #facc15;       /* Quest Gold (Used for 'CLEARED' status) */
  --border: rgba(14, 165, 233, 0.3);
  --bg-dark: #020617;      /* The 'Void' background */
}
```

## 2. The Glassmorphism Recipe
The cards aren't just solid colors; they are semi-transparent "glass" panes that blur the content behind them.

```css
.fc-event-glass-container {
  /* Semi-transparent background (40% opacity of the task color) */
  background: var(--event-bg); 
  
  /* The blurring effect */
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  
  /* Subtle inner border to catch highlights */
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  /* Smooth transitions for interaction */
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
```

## 3. The "Aura" Glow (Neon Shadowing)
The "Solo Leveling" look is defined by the energy aura radiating from objects. This is achieved using multiple layers of `box-shadow`.

```css
/* The dynamic glow based on task color */
.fc-event-glass-container:not(.event-completed) {
  box-shadow: 0 0 12px var(--event-border);
  border-color: var(--event-border);
}

/* The vertical "Power Line" on the left */
.fc-event-glass-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: var(--event-border);
  box-shadow: 0 0 8px var(--event-border);
}

/* Hover/Active State amplification */
.fc-event-glass-container:hover {
  transform: scale(1.02);
  box-shadow: 0 0 20px var(--event-border);
}

.is-active-editing {
  border-color: #fff !important;
  box-shadow: 0 0 25px #fff, 0 0 10px var(--event-border) !important;
  transform: scale(1.05) !important;
}
```

## 4. Typography & System Branding
Text is styled to look like a high-tech RPG interface.

```css
.fc-timegrid-event .fc-event-title {
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-size: 11px;
}

/* Label glows */
.fc .fc-timegrid-slot-label-cushion {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-shadow: 0 0 10px rgba(14, 165, 233, 0.5);
}
```

## 5. Dynamic Logic (JavaScript implementation)
The "secret" to making the colors work is how the `glassColor` is derived from the base task color at runtime.

```typescript
// Derived in CalendarView.tsx
const glassColor = completed 
  ? 'rgba(71, 85, 105, 0.4)' // Faded slate for completed quests
  : baseColor.replace(/rgba?\((.*?)(?:,\s*[\d.]+)?\)/, 'rgba($1, 0.4)'); // 40% opacity for glass effect
```

## 6. Result Summary
By combining **transparency (rgba)**, **background blurring (backdrop-filter)**, **neon shadowing (box-shadow)**, and **industrial typography**, the interface transforms from a standard calendar into a "Solo Leveling" system interface.
