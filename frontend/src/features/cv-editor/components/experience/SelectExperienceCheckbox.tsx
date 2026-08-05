import { Controller, useFormContext, type FieldPath } from "react-hook-form";

import type { Cv } from "@/interfaces/cv-pdf";

import { FieldCheckbox } from "@/components/input/FieldCheckbox";

interface Props {
  name: FieldPath<Cv>;
  label: string;
}

export function SelectExperienceCheckbox({ name, label }: Props) {
  const { control } = useFormContext<Cv>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FieldCheckbox
          name={field.name}
          ref={field.ref}
          onBlur={field.onBlur}
          checked={field.value !== false}
          onChange={(e) => field.onChange(e.target.checked)}
          label={label}
        />
      )}
    />
  );
}
