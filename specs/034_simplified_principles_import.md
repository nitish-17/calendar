- Simplify the guiding principles import format in Settings.
- Format should now be a flat list of alternating labels and principles:
```
- label
- GP
- label 2
- GP 2
```
- Indentation is no longer required and should not be used to determine structure.
- Error/corrupt data checks should be removed; the parser should pair up valid content lines as they appear.
- If an odd number of content lines exist, the last one can be ignored.

## System Log

### Architectural Decisions
- **Simplified Parsing Logic:** Transitioned from a nested, indentation-aware parser to a flat, sequence-based parser. This improves usability by reducing the formatting burden on the user.
- **Lenient Extraction:** The parser now extracts all content lines (optionally prefixed with bullets) and treats them as a flat stream of data to be paired.

### Code Delta
- `src/utils/principleParser.ts`: Rewrote `parsePrinciples` to handle the flat format and removed indentation-based nesting logic.

### Trade-offs
- **Pairing Dependency:** The new format relies on the correct sequence of lines. If a user misses a label or principle, all subsequent pairs will be misaligned. However, this is a direct trade-off for the requested simplicity.
- **Bullet Tolerance:** The parser still allows (and strips) bullets but doesn't strictly require them if the text is clearly separated by lines.
