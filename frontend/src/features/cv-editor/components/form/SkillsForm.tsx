import { Controller, useFieldArray, useFormContext } from "react-hook-form";

import type { Cv } from "@/interfaces/cv-pdf";

import { Card } from "@/features/cv-editor/components/card/Card";
import { splitList } from "@/features/cv-editor/utils/strings";
import { FieldInput } from "@/components/input/FieldInput";

export function SkillsForm() {
  const {
    control,
    formState: { errors }
  } = useFormContext<Cv>();

  const { fields } = useFieldArray({ control, name: "skills" });

  return (
    <Card title="Skills">
      <div className="space-y-3">
        {fields.map((item, i) => (
          <div key={item.id} className="flex gap-2 items-start">
            <Controller
              control={control}
              name={`skills.${i}.category`}
              render={({ field }) => (
                <FieldInput {...field} label="Category" error={errors.skills?.[i]?.category} />
              )}
            />

            <div className="flex-1">
              <Controller
                control={control}
                name={`skills.${i}.items`}
                render={({ field }) => (
                  <FieldInput
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    value={field.value.join(", ")}
                    onChange={(e) => field.onChange(splitList(e.target.value))}
                    label="Items (comma-separated)"
                  />
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
