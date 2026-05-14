- disable autorotate of pwa app (it auto rotates even when auto-rotate of phone is disabled)
- lock orientation to portrait

## System Log: PWA Orientation Lock

### Architectural Decisions
- **Orientation Lock**: Transitioned from `orientation: "any"` to `orientation: "portrait"` in the Web App Manifest.
- **Root Cause Analysis**: The `any` setting in the manifest can sometimes cause the PWA to override system-level rotation locks in "standalone" mode, leading to unexpected layout shifts even when the user has disabled auto-rotate on their device.
- **Mobile-First UX**: Given the app's thumb-reach navigation and time-blocking grid, a portrait-locked orientation ensures a consistent and predictable interface, which is preferred for rapid logging tasks.

### Code Delta
- **`vite.config.ts`**: Updated `manifest.orientation` from `'any'` to `'portrait'`.
