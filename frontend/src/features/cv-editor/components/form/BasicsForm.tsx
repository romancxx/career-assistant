import { Controller, useFieldArray, useFormContext } from "react-hook-form";

import type { Cv } from "@/interfaces/cv-pdf";

import { Card } from "@/features/cv-editor/components/card/Card";
import { AddBtn } from "@/features/cv-editor/components/input/AddBtn";
import { RemoveBtn } from "@/features/cv-editor/components/input/RemoveBtn";
import { FieldCheckbox } from "@/components/input/FieldCheckbox";
import { FieldInput } from "@/components/input/FieldInput";

export function BasicsForm() {
  const {
    control,
    formState: { errors }
  } = useFormContext<Cv>();

  const { fields, append, remove } = useFieldArray({ control, name: "basics.links" });

  return (
    <Card title="Basics">
      <div className="grid grid-cols-2 gap-3">
        <Controller
          control={control}
          name="basics.name"
          render={({ field }) => (
            <FieldInput {...field} label="Name" required error={errors.basics?.name} />
          )}
        />

        <Controller
          control={control}
          name="basics.title"
          render={({ field }) => <FieldInput {...field} label="Title" />}
        />

        <Controller
          control={control}
          name="basics.email"
          render={({ field }) => <FieldInput {...field} label="Email" />}
        />

        <Controller
          control={control}
          name="basics.phone"
          render={({ field }) => <FieldInput {...field} value={field.value ?? ""} label="Phone" />}
        />

        <Controller
          control={control}
          name="basics.location"
          render={({ field }) => (
            <FieldInput {...field} value={field.value ?? ""} label="Location" />
          )}
        />
      </div>

      <div className="mt-3 space-y-2">
        {fields.map((item, i) => (
          <div key={item.id} className="flex gap-2 items-end">
            <div className="flex-1">
              <Controller
                control={control}
                name={`basics.links.${i}.label`}
                render={({ field }) => <FieldInput {...field} label="Link label" />}
              />
            </div>

            <div className="flex-1">
              <Controller
                control={control}
                name={`basics.links.${i}.url`}
                render={({ field }) => <FieldInput {...field} label="URL" />}
              />
            </div>

            <RemoveBtn onClick={() => remove(i)} />
          </div>
        ))}

        <AddBtn label="Add link" onClick={() => append({ label: "", url: "" })} />
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3">
        <Controller
          control={control}
          name="showPhoto"
          render={({ field }) => (
            <FieldCheckbox
              name={field.name}
              ref={field.ref}
              onBlur={field.onBlur}
              checked={field.value ?? true}
              onChange={(e) => field.onChange(e.target.checked)}
              label="Include profile picture"
            />
          )}
        />
      </div>
    </Card>
  );
}
