
export interface ParsedPrinciple {
  label: string;
  text: string;
}

/**
 * Parses a text string into an array of principles.
 * Format:
 * - label
 *   - guiding principle
 */
export const parsePrinciples = (content: string): ParsedPrinciple[] => {
  const lines = content.split('\n');
  const principles: ParsedPrinciple[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Look for a label line: starts with some whitespace, then "- ", then text
    const labelMatch = line.match(/^(\s*)-\s+(.+)$/);

    if (labelMatch) {
      const labelIndent = labelMatch[1].length;
      const label = labelMatch[2].trim();

      // Look for sub-points
      const subPoints: string[] = [];
      let j = i + 1;

      while (j < lines.length) {
        const nextLine = lines[j];
        if (!nextLine.trim()) {
          j++;
          continue;
        }

        const subMatch = nextLine.match(/^(\s*)-\s+(.+)$/);
        if (subMatch) {
          const subIndent = subMatch[1].length;
          if (subIndent > labelIndent) {
            subPoints.push(subMatch[2].trim());
            j++;
          } else {
            // Found another top-level or same-level item
            break;
          }
        } else {
          // Not a bullet point line
          // If it's just text without a bullet, we might want to skip or include?
          // The spec says "the sub point is the guiding principle", implying it HAS a bullet.
          break;
        }
      }

      // Validation: Exactly one sub-point
      if (subPoints.length === 1) {
        principles.push({
          label,
          text: subPoints[0]
        });
      }

      // Move i to the next potential label
      i = j;
    } else {
      i++;
    }
  }

  return principles;
};
