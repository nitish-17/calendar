- currently when i press back button on phone, app gets hidden (goes in background) if i try to open it again, it simply closes itself. 
- simplify the hardware button back functionality: all it should do it ask for confirmation button before closing the application.

## System Log: Simplified Hardware Back Button Handling

### Architectural Decisions
- **Unified Back Behavior**: Streamlined the hardware back button logic to always trigger an exit confirmation dialog. This replaces the complex hierarchical navigation (closing modals -> switching views) with a predictable, single-purpose action.
- **History Interception**: Retained the "Dummy History State" strategy. By maintaining a dummy entry in the history stack, we ensure that every back button press emits a `popstate` event that we can catch to show our custom UI.

### Code Delta
- **`src/hooks/useHardwareBack.ts`**: Removed all dependencies on `AppContext` and hierarchical state checks. The hook now only manages the history stack and the SweetAlert2 exit prompt.

### Technical Notes
- **Dummy State Trick**: `window.history.pushState({ noBack: true }, "")` is pushed on mount. When the back button is pressed, the browser pops this state. If the user cancels the exit, we re-push the state to stay in the app and keep intercepting future back presses.
- **Exit Logic**: If confirmed, `window.history.go(-1)` is called to go back past our dummy state, allowing the browser/PWA to perform its default exit/background action.
