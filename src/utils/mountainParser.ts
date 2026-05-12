
export interface ParsedMountain {
  label: string;
  text: string;
}

/**
 * Parses a text string into an array of mountains.
 * Format:
 * - label
 * - mountain
 * - label 2
 * - mountain 2
 * 
 * The parser is lenient: it pairs any non-empty lines, 
 * stripping optional leading bullets.
 */
export const parseMountains = (content: string): ParsedMountain[] => {
  const lines = content.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => {
      // Remove leading bullet if present (e.g., "- text" or "* text")
      return line.replace(/^[-*]\s*/, '').trim();
    });

  const mountains: ParsedMountain[] = [];
  
  // Pair up lines as label and text
  for (let i = 0; i + 1 < lines.length; i += 2) {
    mountains.push({
      label: lines[i],
      text: lines[i + 1]
    });
  }

  return mountains;
};
