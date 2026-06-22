export const toLines = (value: string) =>
  value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

export const toList = (value: string) =>
  value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
