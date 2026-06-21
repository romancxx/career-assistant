import { PDFParse } from "pdf-parse";

export const EXPECTED_SECTIONS = [
  "Summary",
  "Work Experience",
  "Technical Skills",
  "Education",
] as const;

export async function extractText(pdf: Buffer): Promise<string> {
  const parser = new PDFParse({ data: new Uint8Array(pdf) });
  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy();
  }
}

export interface SectionOrderResult {
  ok: boolean;
  found: string[];
  missing: string[];
  outOfOrder: boolean;
}

export function checkSectionOrder(
  text: string,
  expected: readonly string[] = EXPECTED_SECTIONS,
): SectionOrderResult {
  // Match each heading as a standalone line so body words (e.g. "experience"
  // inside the summary) don't produce false matches.
  const lines = text.split(/\r?\n/).map((l) => l.trim().toLowerCase());
  const positions = expected.map((s) => ({
    section: s,
    index: lines.indexOf(s.toLowerCase()),
  }));

  const missing = positions.filter((p) => p.index === -1).map((p) => p.section);
  const found = positions.filter((p) => p.index !== -1);

  let outOfOrder = false;
  for (let i = 1; i < found.length; i++) {
    if (found[i].index < found[i - 1].index) outOfOrder = true;
  }

  return {
    ok: missing.length === 0 && !outOfOrder,
    found: found.map((p) => p.section),
    missing,
    outOfOrder,
  };
}
