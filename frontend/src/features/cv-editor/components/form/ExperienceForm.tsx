import { useFieldArray, useFormContext } from "react-hook-form";

import type { Cv } from "@/interfaces/cv-pdf";

import { Card } from "@/features/cv-editor/components/card/Card";
import { ExperienceCard } from "@/features/cv-editor/components/card/ExperienceCard";

export function ExperienceForm() {
  const { control } = useFormContext<Cv>();
  const { fields } = useFieldArray({ control, name: "experience" });

  return (
    <Card title="Experience">
      <div className="space-y-5">
        {fields.map((entry, i) => (
          <ExperienceCard key={entry.id} index={i} kind={entry.kind} />
        ))}
      </div>
    </Card>
  );
}
