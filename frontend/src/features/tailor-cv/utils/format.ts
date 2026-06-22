import type { CvExperience, CvSkillGroup } from "@/interfaces/pitch-assistant";

import { formatDates } from "@/features/tailor-cv/utils/dates";

export function experienceToText(experience: CvExperience): string {
  const header = `${experience.companyName} · ${experience.role} · ${formatDates(experience)}`;
  const bullets = experience.achievements.map((achievement) => `• ${achievement}`).join("\n");

  return `${header}\n${bullets}`;
}

export function skillsToText(groups: CvSkillGroup[]): string {
  return groups.map((group) => `${group.category}: ${group.skills.join(", ")}`).join("\n");
}
