export function splitList(value: string): string[] {
  return value.split(",").map(s => s.trim()).filter(Boolean);
}

export function splitLines(value: string): string[] {
  return value.split("\n").map(s => s.trim()).filter(Boolean);
}
