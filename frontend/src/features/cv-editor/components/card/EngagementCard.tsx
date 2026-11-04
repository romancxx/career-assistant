import { Controller, useFormContext } from "react-hook-form";

import type { Cv } from "@/interfaces/cv-pdf";

import { HighlightsArray } from "@/features/cv-editor/components/experience/HighlightsArray";
import { SelectExperienceCheckbox } from "@/features/cv-editor/components/experience/SelectExperienceCheckbox";
import { TagsInput } from "@/features/cv-editor/components/input/TagsInput";
import { FieldInput } from "@/components/input/FieldInput";

interface Props {
  experienceIndex: number;
  index: number;
}

export function EngagementCard({ experienceIndex, index }: Props) {
  const { control } = useFormContext<Cv>();
  const base = `experience.${experienceIndex}.engagements.${index}` as const;

  return (
    <div>
      <div className="mb-3">
        <SelectExperienceCheckbox name={`${base}.selected`} label="Include on CV" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Controller
          control={control}
          name={`${base}.client`}
          render={({ field }) => <FieldInput {...field} label="Client" />}
        />

        <Controller
          control={control}
          name={`${base}.duration`}
          render={({ field }) => <FieldInput {...field} label="Duration" />}
        />
      </div>

      <div className="mt-3">
        <TagsInput name={`${base}.tags`} />
      </div>

      <HighlightsArray name={`${base}.highlights`} />
    </div>
  );
}
