import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { mixed, object, string, type ObjectSchema } from "yup";

import type { Experience, JobType } from "@/interfaces/pitch-assistant";

import { FormActions } from "@/features/profile/components/input/FormActions";
import { toLines, toList } from "@/features/profile/utils/strings";
import { FieldInput } from "@/components/input/FieldInput";
import { FieldSelect } from "@/components/input/FieldSelect";
import { FieldTextarea } from "@/components/input/FieldTextarea";

interface ExperienceFormValues {
  companyName: string;
  role: string;
  jobType: JobType;
  startDate: string;
  endDate: string;
  companyDescription: string;
  stack: string;
  achievements: string;
  context: string;
}

const MONTH = /^\d{4}-\d{2}$/;

const schema: ObjectSchema<ExperienceFormValues> = object({
  companyName: string().trim().required("Company is required"),
  role: string().trim().required("Role is required"),
  jobType: mixed<JobType>().oneOf(["full-time", "contract"]).required(),
  startDate: string()
    .trim()
    .matches(MONTH, "Use format YYYY-MM")
    .required("Start date is required"),
  endDate: string()
    .trim()
    .matches(MONTH, { message: "Use format YYYY-MM", excludeEmptyString: true })
    .default(""),
  companyDescription: string().default(""),
  stack: string().default(""),
  achievements: string().default(""),
  context: string().default("")
});

interface ExperienceFormProps {
  initial?: Experience;
  onSubmit: (data: Experience) => Promise<void>;
  onCancel: () => void;
}

export function ExperienceForm({ initial, onSubmit, onCancel }: ExperienceFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ExperienceFormValues>({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      companyName: initial?.companyName ?? "",
      role: initial?.role ?? "",
      jobType: initial?.jobType ?? "full-time",
      startDate: initial?.startDate ?? "",
      endDate: initial?.endDate ?? "",
      companyDescription: initial?.companyDescription ?? "",
      stack: (initial?.stack ?? []).join(", "),
      achievements: (initial?.achievements ?? []).join("\n"),
      context: initial?.context ?? ""
    }
  });

  const submit = handleSubmit((values) =>
    onSubmit({
      companyName: values.companyName.trim(),
      role: values.role.trim(),
      jobType: values.jobType,
      startDate: values.startDate.trim(),
      endDate: values.endDate.trim() || undefined,
      companyDescription: values.companyDescription.trim() || undefined,
      stack: toList(values.stack),
      achievements: toLines(values.achievements),
      context: values.context.trim() || undefined
    })
  );

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Controller
          control={control}
          name="companyName"
          render={({ field }) => (
            <FieldInput {...field} label="Company" required error={errors.companyName} />
          )}
        />

        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <FieldInput {...field} label="Role" required error={errors.role} />
          )}
        />

        <Controller
          control={control}
          name="jobType"
          render={({ field }) => (
            <FieldSelect {...field} label="Job type" error={errors.jobType}>
              <option value="full-time">full-time</option>

              <option value="contract">contract</option>
            </FieldSelect>
          )}
        />

        <div className="grid grid-cols-2 gap-3">
          <Controller
            control={control}
            name="startDate"
            render={({ field }) => (
              <FieldInput
                {...field}
                label="Start (YYYY-MM)"
                placeholder="2024-01"
                required
                error={errors.startDate}
              />
            )}
          />

          <Controller
            control={control}
            name="endDate"
            render={({ field }) => (
              <FieldInput
                {...field}
                label="End (blank = present)"
                placeholder="2024-12"
                error={errors.endDate}
              />
            )}
          />
        </div>
      </div>

      <Controller
        control={control}
        name="companyDescription"
        render={({ field }) => (
          <FieldInput {...field} label="Company description" error={errors.companyDescription} />
        )}
      />

      <Controller
        control={control}
        name="stack"
        render={({ field }) => (
          <FieldInput
            {...field}
            label="Stack (comma-separated)"
            placeholder="TypeScript, NestJS, Postgres"
            error={errors.stack}
          />
        )}
      />

      <Controller
        control={control}
        name="achievements"
        render={({ field }) => (
          <FieldTextarea
            {...field}
            label="Achievements (one per line)"
            rows={4}
            error={errors.achievements}
          />
        )}
      />

      <Controller
        control={control}
        name="context"
        render={({ field }) => (
          <FieldInput
            {...field}
            label="Context"
            placeholder="Industry: ..."
            error={errors.context}
          />
        )}
      />

      <FormActions onCancel={onCancel} submitting={isSubmitting} />
    </form>
  );
}
