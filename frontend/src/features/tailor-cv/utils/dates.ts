import type {CvExperience} from "@/interfaces/pitch-assistant";

export function formatDates(e: CvExperience): string {
  return `${e.startDate} – ${e.endDate ?? "present"}`;
}
