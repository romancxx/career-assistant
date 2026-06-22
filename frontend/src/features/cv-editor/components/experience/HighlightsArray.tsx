import { Controller, useFormContext } from "react-hook-form";

import type { FieldPath } from "react-hook-form";
import type { Cv } from "@/interfaces/cv-pdf";

import { AddBtn } from "@/features/cv-editor/components/input/AddBtn";
import { RemoveBtn } from "@/features/cv-editor/components/input/RemoveBtn";

interface Props {
  // Dot-path to a `string[]` field within the CV (e.g. experience highlights).
  name: string;
}

export function HighlightsArray({ name }: Props) {
  const { control } = useFormContext<Cv>();

  return (
    <Controller
      control={control}
      name={name as FieldPath<Cv>}
      render={({ field }) => {
        const items = (field.value as string[] | undefined) ?? [];
        const set = (next: string[]) => field.onChange(next);

        return (
          <div className="mt-3 space-y-2">
            <span className="text-xs font-medium text-slate-500">Highlights</span>

            {items.map((highlight, i) => (
              <div key={i} className="flex gap-2 items-start">
                <textarea
                  className="flex-1 border border-slate-300 rounded px-2 py-1 text-sm"
                  rows={2}
                  value={highlight}
                  onChange={(e) => set(items.map((h, j) => (j === i ? e.target.value : h)))}
                />

                <RemoveBtn onClick={() => set(items.filter((_, j) => j !== i))} />
              </div>
            ))}

            <AddBtn label="Add highlight" onClick={() => set([...items, ""])} />
          </div>
        );
      }}
    />
  );
}
