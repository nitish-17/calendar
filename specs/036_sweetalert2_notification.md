- use sweetalert2 for notification
- build component or whatever is required for notifications
- update the notification code wherever alter was used

## System Log

### Architectural Decisions
- **Notification Utility:** Created a `notify` utility wrapper around `SweetAlert2` in `src/utils/notifications.ts`. This centralizes the styling and configuration, ensuring that all toasts and dialogs match the application's dark theme and brand colors.
- **Async Confirmations:** Utilized `notify.confirm` as an async function to handle user confirmations, providing a more modern and non-blocking alternative to `window.confirm`.
- **Toast for Success:** Success messages use a non-intrusive "toast" style that automatically disappears after 3 seconds, while errors and confirmations remain centered for visibility.

### Code Delta
- `src/utils/notifications.ts`: New utility for handling success, error, info, and confirmation notifications.
- `src/components/SettingsView.tsx`: Refactored to use `notify` instead of `alert()` and `window.confirm()`. Added `setTimeout` for page reloads to ensure the success toast is visible before the refresh.

### Trade-offs
- **Package Dependency:** Added `sweetalert2` as a dependency. While it increases the bundle size slightly, it significantly improves the professional feel and user experience compared to native browser alerts.
- **Reload Delay:** Introduced a 1.5s delay before `window.location.reload()` during imports and purges. This ensures the user sees the "Success" confirmation toast, preventing the jarring experience of an immediate refresh before the feedback is acknowledged.

