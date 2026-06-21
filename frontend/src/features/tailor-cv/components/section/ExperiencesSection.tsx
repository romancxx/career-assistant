import type {CvExperience} from "@/interfaces/pitch-assistant";

import {ExperienceItem} from "@/features/tailor-cv/components/container/ExperienceItem";
import {CopyButton} from "@/features/tailor-cv/components/input/CopyButton";
import {experienceToText} from "@/features/tailor-cv/utils/format";

interface Props {
  experiences: CvExperience[];
}

export function ExperiencesSection({experiences}: Props) {
  return (
    <section className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">Experiences</h2>

        <CopyButton
          label="Copy all"
          text={experiences.map(experienceToText).join("\n\n")}
        />
      </div>

      <div className="space-y-4">
        {experiences.map((e, i) => (
          <ExperienceItem key={`${e.companyName}-${i}`} experience={e} />
        ))}
      </div>
    </section>
  );
}
