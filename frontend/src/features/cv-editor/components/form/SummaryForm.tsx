import { Controller, useFormContext } from "react-hook-form";

import type { Cv } from "@/interfaces/cv-pdf";

import { Card } from "@/features/cv-editor/components/card/Card";
import { FieldTextarea } from "@/components/input/FieldTextarea";

export function SummaryForm() {
  const {
    control,
    formState: { errors }
  } = useFormContext<Cv>();

  return (
    <Card title="Summary">
      <Controller
        control={control}
        name="summary"
        render={({ field }) => (
          <FieldTextarea {...field} label="Summary" rows={4} error={errors.summary} />
        )}
      />
    </Card>
  );
}
