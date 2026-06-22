import { Controller, useFormContext } from "react-hook-form";

import type { Cv } from "@/interfaces/cv-pdf";

import { HighlightsArray } from "@/features/cv-editor/components/experience/HighlightsArray";
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
      <div className="grid grid-cols-3 gap-3">
        <Controller
          control={control}
          name={`${base}.client`}
          render={({ field }) => <FieldInput {...field} label="Client" />}
        />

        <Controller
          control={control}
          name={`${base}.role`}
          render={({ field }) => <FieldInput {...field} label="Role" />}
        />

        <Controller
          control={control}
          name={`${base}.duration`}
          render={({ field }) => <FieldInput {...field} label="Duration" />}
        />
      </div>

      <div className="mt-3">
        <Controller
          control={control}
          name={`${base}.tagline`}
          render={({ field }) => (
            <FieldInput {...field} value={field.value ?? ""} label="Tagline" />
          )}
        />
      </div>

      <HighlightsArray name={`${base}.highlights`} />
    </div>
  );
}
