import {yupResolver} from "@hookform/resolvers/yup";
import {Controller, useForm} from "react-hook-form";
import {object, string, type ObjectSchema} from "yup";

import type {Project} from "@/interfaces/cv-pdf";

import {splitLines} from "@/features/cv-editor/utils/strings";
import {FieldInput} from "@/components/input/FieldInput";
import {FieldTextarea} from "@/components/input/FieldTextarea";

interface ProjectFormValues {
  name: string;
  description: string;
  link: string;
  highlights: string;
}

const schema: ObjectSchema<ProjectFormValues> = object({
  name: string().trim().required("Name is required"),
  description: string().default(""),
  link: string().trim().url("Must be a valid URL").default(""),
  highlights: string().default(""),
});

interface Props {
  initial?: Project;
  onSubmit: (project: Project) => void;
  onCancel: () => void;
}

export function ProjectForm({initial, onSubmit, onCancel}: Props) {
  const {
    control,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<ProjectFormValues>({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      name: initial?.name ?? "",
      description: initial?.description ?? "",
      link: initial?.link ?? "",
      highlights: (initial?.highlights ?? []).join("\n"),
    },
  });

  const submit = handleSubmit(values =>
    onSubmit({
      name: values.name.trim(),
      description: values.description.trim() || undefined,
      link: values.link.trim() || undefined,
      highlights: splitLines(values.highlights),
    }),
  );

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Controller
          control={control}
          name="name"
          render={({field}) => (
            <FieldInput {...field} label="Name" required error={errors.name} />
          )}
        />

        <Controller
          control={control}
          name="link"
          render={({field}) => (
            <FieldInput
              {...field}
              label="Link"
              placeholder="https://github.com/you/project"
              error={errors.link}
            />
          )}
        />
      </div>

      <Controller
        control={control}
        name="description"
        render={({field}) => (
          <FieldInput
            {...field}
            label="Description"
            error={errors.description}
          />
        )}
      />

      <Controller
        control={control}
        name="highlights"
        render={({field}) => (
          <FieldTextarea
            {...field}
            label="Highlights (one per line)"
            rows={4}
            error={errors.highlights}
          />
        )}
      />

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800 disabled:opacity-50"
        >
          Save
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-xs font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
