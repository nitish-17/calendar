
export interface ParsedVision {
  label: string;
  text: string;
}

/**
 * Parses a text string into an array of visions.
 * Format:
 * - label
 * - vision
 * - label 2
 * - vision 2
 * 
 * The parser is lenient: it pairs any non-empty lines, 
 * stripping optional leading bullets.
 */
export const parseVisions = (content: string): ParsedVision[] => {
  const lines = content.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => {
      // Remove leading bullet if present (e.g., "- text" or "* text")
      return line.replace(/^[-*]\s*/, '').trim();
    });

  const visions: ParsedVision[] = [];
  
  // Pair up lines as label and text
  for (let i = 0; i + 1 < lines.length; i += 2) {
    visions.push({
      label: lines[i],
      text: lines[i + 1]
    });
  }

  return visions;
};
