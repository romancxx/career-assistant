import { Controller, useFieldArray, useFormContext } from "react-hook-form";

import type { Cv } from "@/interfaces/cv-pdf";

import { Card } from "@/features/cv-editor/components/card/Card";
import { FieldInput } from "@/components/input/FieldInput";

export function EducationForm() {
  const {
    control,
    formState: { errors }
  } = useFormContext<Cv>();

  const { fields } = useFieldArray({ control, name: "education" });

  return (
    <Card title="Education">
      <div className="space-y-4">
        {fields.map((item, i) => (
          <div key={item.id} className="grid grid-cols-2 gap-3">
            <Controller
              control={control}
              name={`education.${i}.institution`}
              render={({ field }) => (
                <FieldInput
                  {...field}
                  label="Institution"
                  error={errors.education?.[i]?.institution}
                />
              )}
            />

            <Controller
              control={control}
              name={`education.${i}.program`}
              render={({ field }) => <FieldInput {...field} label="Program" />}
            />

            <Controller
              control={control}
              name={`education.${i}.start`}
              render={({ field }) => <FieldInput {...field} label="Start" />}
            />

            <Controller
              control={control}
              name={`education.${i}.end`}
              render={({ field }) => <FieldInput {...field} label="End" />}
            />

            <div className="col-span-2">
              <Controller
                control={control}
                name={`education.${i}.notes`}
                render={({ field }) => (
                  <FieldInput {...field} value={field.value ?? ""} label="Notes" />
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
