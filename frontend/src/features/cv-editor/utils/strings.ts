export function splitList(value: string): string[] {
  return value.split(",").map(s => s.trim()).filter(Boolean);
}
