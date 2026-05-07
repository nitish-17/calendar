- add `base: "/calendar/"` to vite.config.ts
- add relevant lines in package.json to be able to use for gh-pages for github deployment

## System Log - 2026-05-07

### Architectural Decisions
- **Base Path Configuration**: Set the `base` property in `vite.config.ts` to `/calendar/`. This is critical for GitHub Pages as the site is typically served from a sub-directory named after the repository.
- **Deployment Strategy**: Chose the `gh-pages` npm package for a simple, one-command deployment workflow. This allows the user to easily push the production build to the `gh-pages` branch.

### Code Delta
- **`vite.config.ts`**: Added `base: "/calendar/"`.
- **`package.json`**:
  - Added `gh-pages` to `devDependencies`.
  - Added `predeploy` script to ensure a fresh build before every deployment.
  - Added `deploy` script to push the `dist` folder to the `gh-pages` branch.

### Trade-offs
- **Manual vs. Automated**: This setup requires a manual `npm run deploy` command. While a GitHub Action could automate this on every push, a manual script offers more control and is simpler to set up initially.
- **Sub-directory vs. Custom Domain**: The `/calendar/` base path assumes the app will live at `https://<username>.github.io/calendar/`. If a custom domain is added later, the `base` path will need to be updated to `/`.
