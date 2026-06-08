// Drops null/undefined values so serialized objects match the optional-field
// shape that input types expect (e.g. when writing backup files re-read by the
// seed script).
export function stripEmpty(obj: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== null && v !== undefined),
  );
}
