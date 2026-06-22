import { Controller, useFieldArray, useFormContext } from "react-hook-form";

import type { Cv } from "@/interfaces/cv-pdf";

import { Card } from "@/features/cv-editor/components/card/Card";
import { HighlightsArray } from "@/features/cv-editor/components/experience/HighlightsArray";
import { AddBtn } from "@/features/cv-editor/components/input/AddBtn";
import { RemoveBtn } from "@/features/cv-editor/components/input/RemoveBtn";
import { FieldInput } from "@/components/input/FieldInput";

const EMPTY_PROJECT = { name: "", description: "", link: "", highlights: [] };

export function ProjectsForm() {
  const {
    control,
    formState: { errors }
  } = useFormContext<Cv>();

  const { fields, append, remove } = useFieldArray({ control, name: "projects" });

  return (
    <Card title="Projects">
      <div className="space-y-4">
        {fields.map((item, i) => (
          <div key={item.id} className="border border-slate-200 rounded-md p-4 bg-white space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="grid grid-cols-2 gap-3 flex-1">
                <Controller
                  control={control}
                  name={`projects.${i}.name`}
                  render={({ field }) => (
                    <FieldInput
                      {...field}
                      label="Name"
                      required
                      error={errors.projects?.[i]?.name}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name={`projects.${i}.link`}
                  render={({ field }) => (
                    <FieldInput {...field} value={field.value ?? ""} label="Link" />
                  )}
                />
              </div>

              <RemoveBtn onClick={() => remove(i)} />
            </div>

            <Controller
              control={control}
              name={`projects.${i}.description`}
              render={({ field }) => (
                <FieldInput {...field} value={field.value ?? ""} label="Description" />
              )}
            />

            <HighlightsArray name={`projects.${i}.highlights`} />
          </div>
        ))}

        <AddBtn label="Add project" onClick={() => append(EMPTY_PROJECT)} />
      </div>
    </Card>
  );
}
