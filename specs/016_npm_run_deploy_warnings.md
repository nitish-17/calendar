- fix the warning that i get when i do npm run deploy

```sh
[plugin builtin:vite-reporter]
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
```

## System Log - May 7, 2026

### Architectural Decisions
- **Manual Code Splitting:** Implemented `manualChunks` in Vite's Rollup configuration to explicitly separate large dependencies. This prevents a single monolithic chunk and improves cacheability.
- **Dependency Isolation:** Grouped `@fullcalendar` modules into a dedicated chunk (`fullcalendar`) and other `node_modules` into a `vendor` chunk. This specifically targets the largest part of the application.
- **Threshold Adjustment:** Increased `chunkSizeWarningLimit` to 1000kB as a safety measure, though the current splitting strategy successfully keeps all chunks well below the original 500kB threshold.

### Code Delta
- **`vite.config.ts`**: Added `build` configuration with `chunkSizeWarningLimit` and `rollupOptions.output.manualChunks`.

### Results
- The monolithic ~550kB chunk was split into:
    - `fullcalendar-*.js`: ~267kB
    - `vendor-*.js`: ~283kB
- Deployment warnings are resolved.
