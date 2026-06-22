import type { CvDocument } from "@/interfaces/pitch-assistant";

export function downloadJson(cv: CvDocument) {
  const blob = new Blob([JSON.stringify(cv, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `cv-${cv.meta.targetJdTitle ?? "tailored"}.json`.replace(/\s+/g, "-");
  link.click();
  URL.revokeObjectURL(url);
}
