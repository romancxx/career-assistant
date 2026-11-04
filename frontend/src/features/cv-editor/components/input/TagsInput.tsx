import { useState } from "react";

import { Controller, useFormContext } from "react-hook-form";

import type { FieldPath } from "react-hook-form";
import type { Cv } from "@/interfaces/cv-pdf";

import { splitList } from "@/features/cv-editor/utils/strings";
import { FieldInput } from "@/components/input/FieldInput";

interface Props {
  // Dot-path to a `string[]` tags field within the CV (e.g. engagement tags).
  name: string;
}

export function TagsInput({ name }: Props) {
  const { control } = useFormContext<Cv>();

  return (
    <Controller
      control={control}
      name={name as FieldPath<Cv>}
      render={({ field }) => (
        <TagsField
          name={field.name}
          initial={(field.value as string[] | undefined) ?? []}
          onBlur={field.onBlur}
          onChange={field.onChange}
        />
      )}
    />
  );
}

interface TagsFieldProps {
  name: string;
  initial: string[];
  onBlur: () => void;
  onChange: (tags: string[]) => void;
}

// Keeps the raw text locally so a trailing comma survives while typing; the
// parent card remounts on form reset, which re-seeds the draft.
function TagsField({ name, initial, onBlur, onChange }: TagsFieldProps) {
  const [draft, setDraft] = useState(initial.join(", "));

  return (
    <FieldInput
      name={name}
      value={draft}
      onBlur={onBlur}
      onChange={(e) => {
        setDraft(e.target.value);
        onChange(splitList(e.target.value));
      }}
      label="Tags (comma-separated)"
    />
  );
}
