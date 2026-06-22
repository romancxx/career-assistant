import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { mixed, object, string, type ObjectSchema } from "yup";

import type { Skill } from "@/interfaces/pitch-assistant";

import { FormActions } from "@/features/profile/components/input/FormActions";
import { FieldInput } from "@/components/input/FieldInput";
import { FieldSelect } from "@/components/input/FieldSelect";

interface SkillFormValues {
  name: string;
  level: Skill["level"];
  years: string;
}

const schema: ObjectSchema<SkillFormValues> = object({
  name: string().trim().required("Name is required"),
  level: mixed<Skill["level"]>().oneOf(["expert", "strong", "competent"]).required(),
  years: string()
    .matches(/^\d+$/, {
      message: "Enter a whole number",
      excludeEmptyString: true
    })
    .default("")
});

interface SkillFormProps {
  initial?: Skill;
  onSubmit: (data: Skill) => Promise<void>;
  onCancel: () => void;
}

export function SkillForm({ initial, onSubmit, onCancel }: SkillFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SkillFormValues>({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      name: initial?.name ?? "",
      level: initial?.level ?? "competent",
      years: initial?.yearsOfExperience?.toString() ?? ""
    }
  });

  const submit = handleSubmit((values) =>
    onSubmit({
      name: values.name.trim(),
      level: values.level,
      yearsOfExperience: values.years.trim() ? Number(values.years) : undefined
    })
  );

  return (
    <form onSubmit={submit} className="grid grid-cols-3 gap-3 items-end">
      <Controller
        control={control}
        name="name"
        render={({ field }) => <FieldInput {...field} label="Name" required error={errors.name} />}
      />

      <Controller
        control={control}
        name="level"
        render={({ field }) => (
          <FieldSelect {...field} label="Level" error={errors.level}>
            <option value="expert">expert</option>

            <option value="strong">strong</option>

            <option value="competent">competent</option>
          </FieldSelect>
        )}
      />

      <Controller
        control={control}
        name="years"
        render={({ field }) => (
          <FieldInput {...field} label="Years" type="number" min="0" error={errors.years} />
        )}
      />

      <div className="col-span-3">
        <FormActions onCancel={onCancel} submitting={isSubmitting} />
      </div>
    </form>
  );
}
