import { Controller, useFieldArray, useFormContext } from "react-hook-form";

import type { Cv } from "@/interfaces/cv-pdf";

import { EngagementCard } from "@/features/cv-editor/components/card/EngagementCard";
import { HighlightsArray } from "@/features/cv-editor/components/experience/HighlightsArray";
import { FieldInput } from "@/components/input/FieldInput";

interface Props {
  index: number;
  kind: "grouped" | "role";
}

export function ExperienceCard({ index, kind }: Props) {
  const { control } = useFormContext<Cv>();

  if (kind === "role") {
    return (
      <div className="border border-slate-200 rounded-md p-4 bg-white">
        <div className="grid grid-cols-2 gap-3">
          <Controller
            control={control}
            name={`experience.${index}.company`}
            render={({ field }) => <FieldInput {...field} label="Company" />}
          />

          <Controller
            control={control}
            name={`experience.${index}.role`}
            render={({ field }) => <FieldInput {...field} label="Role" />}
          />

          <Controller
            control={control}
            name={`experience.${index}.start`}
            render={({ field }) => <FieldInput {...field} label="Start" />}
          />

          <Controller
            control={control}
            name={`experience.${index}.end`}
            render={({ field }) => <FieldInput {...field} label="End" />}
          />
        </div>

        <div className="mt-3">
          <Controller
            control={control}
            name={`experience.${index}.tagline`}
            render={({ field }) => (
              <FieldInput {...field} value={field.value ?? ""} label="Tagline" />
            )}
          />
        </div>

        <HighlightsArray name={`experience.${index}.highlights`} />
      </div>
    );
  }

  return (
    <div className="border border-slate-200 rounded-md p-4 bg-white">
      <div className="grid grid-cols-2 gap-3">
        <Controller
          control={control}
          name={`experience.${index}.title`}
          render={({ field }) => <FieldInput {...field} label="Title" />}
        />

        <div />

        <Controller
          control={control}
          name={`experience.${index}.start`}
          render={({ field }) => <FieldInput {...field} label="Start" />}
        />

        <Controller
          control={control}
          name={`experience.${index}.end`}
          render={({ field }) => <FieldInput {...field} label="End" />}
        />
      </div>

      <div className="mt-3">
        <Controller
          control={control}
          name={`experience.${index}.note`}
          render={({ field }) => <FieldInput {...field} value={field.value ?? ""} label="Note" />}
        />
      </div>

      <EngagementsList experienceIndex={index} />
    </div>
  );
}

function EngagementsList({ experienceIndex }: { experienceIndex: number }) {
  const { control } = useFormContext<Cv>();
  const { fields } = useFieldArray({
    control,
    name: `experience.${experienceIndex}.engagements`
  });

  return (
    <div className="mt-4 space-y-4 pl-4 border-l-2 border-slate-100">
      {fields.map((engagement, i) => (
        <EngagementCard key={engagement.id} experienceIndex={experienceIndex} index={i} />
      ))}
    </div>
  );
}
