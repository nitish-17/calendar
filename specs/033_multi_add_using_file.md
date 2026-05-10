- in the settings view -> guiding principles section -> add a button called "import" (rename other button to add)
- when you click button, you will be asked to select a file from your local system (.txt or .md)
- the text in the file should be in the format

```
- label
  - guiding principle
- label 2
  - guiding principle 2
```

- the first level points are lables of a guiding principle and the sub point is the guiding principle corresponding to that lable (indentation of subpoint can vary)
- in case any error like point having no sub point or point having multiple subpoints etc, ignore them and process rest of the text
- you add each label and corresponding guiding principle as a new preset. you don't clear old, existing ones. you just add new ones.

## System Log

### Architectural Decisions
- **Parser Utility:** Created a dedicated `principleParser` utility to handle the specific bullet-point format. This keeps the parsing logic testable and separate from UI concerns.
- **Bulk Addition:** Enhanced the `useGuidingPrinciples` hook with a `bulkAddPrinciples` method using Dexie's `bulkAdd`. This is more efficient than individual additions and ensures the UI only refreshes once after a large import.
- **UI Decoupling:** Used separate `useRef` hooks for database JSON import and text/markdown principle import to maintain clear state management and avoid event listener collisions.

### Code Delta
- `src/utils/principleParser.ts`: New utility for parsing the nested bullet-point format.
- `src/hooks/useGuidingPrinciples.ts`: Added `bulkAddPrinciples` method.
- `src/components/SettingsView.tsx`: 
    - Added "Import" button with `FileText` icon.
    - Renamed "Add Preset" to "Add".
    - Implemented `handlePrinciplesImport` file handler.
    - Refactored file input refs to `dbImportRef` and `principlesImportRef`.

### Trade-offs
- **Strict Format:** The parser strictly looks for `- ` bullets. This follows the user requirement exactly but might miss principles if users use other bullet types (like `*` or `1.`). This was chosen for precision and simplicity.
- **Indentation Logic:** The parser uses relative indentation (`subIndent > labelIndent`). This is robust against common copy-paste issues but requires the sub-point to be physically indented more than its parent label.
- **Error Handling:** Invalid entries are silently ignored as per the spec, which provides a "forgiving" import experience.

