import {yupResolver} from "@hookform/resolvers/yup";
import {Controller, useForm} from "react-hook-form";
import {mixed, object, string, type ObjectSchema} from "yup";

import type {Language, Person, Rule} from "@/interfaces/pitch-assistant";
import {
  DEFAULT_LANGUAGE,
  DEFAULT_PERSON,
  LANGUAGE_LABELS,
  PERSON_LABELS,
} from "@/interfaces/pitch-assistant";

import {FormActions} from "@/features/profile/components/input/FormActions";
import {FieldSelect} from "@/components/input/FieldSelect";
import {FieldTextarea} from "@/components/input/FieldTextarea";

interface RuleFormValues {
  text: string;
  language: Language;
  person: Person;
}

const schema: ObjectSchema<RuleFormValues> = object({
  text: string().trim().required("Rule text is required"),
  language: mixed<Language>().oneOf(["en", "fr"]).required(),
  person: mixed<Person>().oneOf(["first", "third"]).required(),
});

interface RuleFormProps {
  initial?: Rule;
  onSubmit: (data: Rule) => Promise<void>;
  onCancel: () => void;
}

export function RuleForm({initial, onSubmit, onCancel}: RuleFormProps) {
  const {
    control,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<RuleFormValues>({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      text: initial?.text ?? "",
      language: initial?.language ?? DEFAULT_LANGUAGE,
      person: initial?.person ?? DEFAULT_PERSON,
    },
  });

  const submit = handleSubmit(values =>
    onSubmit({
      text: values.text.trim(),
      language: values.language,
      person: values.person,
    }),
  );

  return (
    <form onSubmit={submit} className="space-y-3">
      <Controller
        control={control}
        name="text"
        render={({field}) => (
          <FieldTextarea
            {...field}
            label="Rule"
            rows={2}
            required
            error={errors.text}
          />
        )}
      />

      <div className="grid grid-cols-2 gap-3">
        <Controller
          control={control}
          name="language"
          render={({field}) => (
            <FieldSelect {...field} label="Language" error={errors.language}>
              {(Object.keys(LANGUAGE_LABELS) as Language[]).map(l => (
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
          render={({field}) => (
            <FieldSelect {...field} label="Person" error={errors.person}>
              {(Object.keys(PERSON_LABELS) as Person[]).map(p => (
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
