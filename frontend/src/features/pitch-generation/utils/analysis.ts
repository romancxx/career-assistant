import type {GenerationResult} from "@/interfaces/pitch-assistant";

export function tagsFromAnalysis(result: GenerationResult): string[] {
  const skills = [
    ...result.jdAnalysis.requiredSkills,
    ...result.jdAnalysis.niceToHaveSkills,
  ];
  return Array.from(
    new Set(skills.map(s => s.trim().toLowerCase()).filter(Boolean)),
  );
}
