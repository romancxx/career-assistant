import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { mixed, object, string, type ObjectSchema } from "yup";

import type { Language, Person, Pitch } from "@/interfaces/pitch-assistant";
import {
  DEFAULT_LANGUAGE,
  DEFAULT_PERSON,
  LANGUAGE_LABELS,
  PERSON_LABELS
} from "@/interfaces/pitch-assistant";

import { FormActions } from "@/features/profile/components/input/FormActions";
import { toList } from "@/features/profile/utils/strings";
import { FieldInput } from "@/components/input/FieldInput";
import { FieldSelect } from "@/components/input/FieldSelect";
import { FieldTextarea } from "@/components/input/FieldTextarea";

interface PitchFormValues {
  text: string;
  roleType: string;
  tags: string;
  language: Language;
  person: Person;
}

const schema: ObjectSchema<PitchFormValues> = object({
  text: string().trim().required("Pitch text is required"),
  roleType: string().default(""),
  tags: string().default(""),
  language: mixed<Language>().oneOf(["en", "fr"]).required(),
  person: mixed<Person>().oneOf(["first", "third"]).required()
});

interface PitchFormProps {
  initial?: Pitch;
  onSubmit: (data: Pitch) => Promise<void>;
  onCancel: () => void;
}

export function PitchForm({ initial, onSubmit, onCancel }: PitchFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<PitchFormValues>({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      text: initial?.text ?? "",
      roleType: initial?.roleType ?? "",
      tags: (initial?.tags ?? []).join(", "),
      language: initial?.language ?? DEFAULT_LANGUAGE,
      person: initial?.person ?? DEFAULT_PERSON
    }
  });

  const submit = handleSubmit((values) =>
    onSubmit({
      text: values.text.trim(),
      roleType: values.roleType.trim() || undefined,
      tags: toList(values.tags),
      language: values.language,
      person: values.person
    })
  );

  return (
    <form onSubmit={submit} className="space-y-3">
      <Controller
        control={control}
        name="text"
        render={({ field }) => (
          <FieldTextarea {...field} label="Pitch text" rows={5} required error={errors.text} />
        )}
      />

      <div className="grid grid-cols-4 gap-3">
        <Controller
          control={control}
          name="roleType"
          render={({ field }) => (
            <FieldInput
              {...field}
              label="Role type"
              placeholder="Senior Backend Engineer"
              error={errors.roleType}
            />
          )}
        />

        <Controller
          control={control}
          name="tags"
          render={({ field }) => (
            <FieldInput {...field} label="Tags (comma-separated)" error={errors.tags} />
          )}
        />

        <Controller
          control={control}
          name="language"
          render={({ field }) => (
            <FieldSelect {...field} label="Language" error={errors.language}>
              {(Object.keys(LANGUAGE_LABELS) as Language[]).map((l) => (
                <option key={l} value={l}>
                  {LANGUAGE_LABELS[l]}
                </option>
              ))}
            </FieldSelect>
          )}
        />

        <Controller
          control={control}
          name="person"
          render={({ field }) => (
            <FieldSelect {...field} label="Person" error={errors.person}>
              {(Object.keys(PERSON_LABELS) as Person[]).map((p) => (
                <option key={p} value={p}>
                  {PERSON_LABELS[p]}
                </option>
              ))}
            </FieldSelect>
          )}
        />
      </div>

      <FormActions onCancel={onCancel} submitting={isSubmitting} />
    </form>
  );
}
