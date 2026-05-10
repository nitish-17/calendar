- change everywhere i.e., html title, pwa title etc, instead of using different names for app like flowlog, calendar etc - consistently use "Locus" as the app name (no subtitle or description is required)
- For app logo - generate icon svg for this - circle and a dot at the center. color - use primary color. add glow to logo if possible.
- delete other unsued public assets.

## System Log - 2026-05-10
- Renamed application to "Locus" across all configuration and metadata:
    - Updated `index.html` title and Apple-specific tags.
    - Updated `package.json` name to "locus".
    - Updated `vite.config.ts` PWA manifest with new name, short name, and description.
- Generated new `favicon.svg` logo:
    - Designed as a primary-colored circle with a central dot and SVG glow filter.
    - Simplified icon requirements in manifest.
- Cleaned up assets:
    - Deleted `src/assets/hero.png`, `src/assets/react.svg`, and `src/assets/vite.svg`.
