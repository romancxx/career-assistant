import type {Cv} from "@/interfaces/cv-pdf";

import {Card} from "@/features/cv-editor/components/card/Card";
import {ExperienceCard} from "@/features/cv-editor/components/card/ExperienceCard";

interface Props {
  experience: Cv["experience"];
  update: (fn: (draft: Cv) => void) => void;
}

export function ExperienceSection({experience, update}: Props) {
  return (
    <Card title="Experience">
      <div className="space-y-5">
        {experience.map((entry, i) => (
          <ExperienceCard
            key={i}
            entry={entry}
            onChange={fn => update(d => fn(d.experience[i]))}
          />
        ))}
      </div>
    </Card>
  );
}
