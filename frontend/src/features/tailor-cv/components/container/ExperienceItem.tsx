import type {CvExperience} from "@/interfaces/pitch-assistant";

import {CopyButton} from "@/features/tailor-cv/components/input/CopyButton";
import {formatDates} from "@/features/tailor-cv/utils/dates";
import {experienceToText} from "@/features/tailor-cv/utils/format";

interface Props {
  experience: CvExperience;
}

export function ExperienceItem({experience}: Props) {
  return (
    <div className="border-t border-slate-100 pt-4 first:border-t-0 first:pt-0">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-800">
          {experience.companyName} · {experience.role}{" "}
          <span className="font-normal text-slate-400">
            · {formatDates(experience)}
          </span>
        </p>

        <CopyButton text={experienceToText(experience)} />
      </div>

      <ul className="mt-2 space-y-1">
        {experience.achievements.map((achievement, index) => (
          <li key={index} className="text-sm text-slate-700 flex gap-2">
            <span className="text-slate-400">•</span>

            <span>{achievement}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
