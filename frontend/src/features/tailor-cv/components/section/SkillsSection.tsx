import type { CvSkillGroup } from "@/interfaces/pitch-assistant";

import { CopyButton } from "@/features/tailor-cv/components/input/CopyButton";
import { skillsToText } from "@/features/tailor-cv/utils/format";

interface Props {
  skills: CvSkillGroup[];
}

export function SkillsSection({ skills }: Props) {
  return (
    <section className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">Skills</h2>

        <CopyButton text={skillsToText(skills)} />
      </div>

      <div className="space-y-1.5">
        {skills.map((group) => (
          <p key={group.category} className="text-sm text-slate-700">
            <span className="font-medium">{group.category}:</span> {group.skills.join(", ")}
          </p>
        ))}
      </div>
    </section>
  );
}
