- add a new section in the settings view, call it guide (use scroll icon)
- place the following text in it without modification

```
- Effort over Result
- Focus on the effort, which is entirely within your control, rather than the result, which often is not. Define success by the integrity of your effort, regardless of the final result.

- Effort over Planning
- Effort builds momentum and leads to clarity, whereas planning often leads to disappointment or paralysis.

- Consistent & Sustainable Effort
- Focus on tiny, consistent efforts, which are manageable, rather than occasional massive efforts, which are not sustainable.

- Validation in Effort
- Find validation in your own effort, which is yours to maintain, rather than in the opinions of others, which you cannot dictate.

- Effort in the Present
- Live in the present, which is the only place where your effort has power, rather than in the past or future, which you cannot influence.
```

- this text should be read only

## System Log

### Architectural Decisions
- **Static Content Section:** Integrated the 'Guide' section as a static, read-only `CollapsibleSection` within `SettingsView`. This provides users with persistent philosophical context without cluttering the interactive data management areas.
- **UI Consistency:** Used the existing `CollapsibleSection` component and established Tailwind patterns to ensure the new section feels native to the application.

### Code Delta
- `src/components/SettingsView.tsx`:
    - Imported `Scroll` icon from `lucide-react`.
    - Added "Guide" section with the specified text before the "Auto Schedule" section.

### Trade-offs
- **Hardcoded Content:** The guide text is hardcoded in the component. This is appropriate for foundational philosophy that isn't intended to change, but would require a code update to modify. This was chosen for simplicity and to guarantee the exact text remains unchanged as per the spec.

