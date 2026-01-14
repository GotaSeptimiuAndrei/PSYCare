// utils/tooltipText.ts
export function processNotes(note: string): string[] {
  if (!note) return [];

  const parts = note.split("; ");

  const truncated = parts.map((p) =>
    p.length > 50 ? p.slice(0, 50) + "…" : p
  );

  if (truncated.length > 3) {
    return [
      truncated[0],
      truncated[1],
      `+ ${truncated.length - 2} more…`,
    ];
  }

  return truncated;
}
