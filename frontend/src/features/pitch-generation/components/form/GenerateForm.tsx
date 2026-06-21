import {yupResolver} from "@hookform/resolvers/yup";
import {Controller, useForm, useWatch} from "react-hook-form";
import {mixed, object, string, type ObjectSchema} from "yup";

import type {Language, Person} from "@/interfaces/pitch-assistant";
import {
  DEFAULT_LANGUAGE,
  DEFAULT_PERSON,
  LANGUAGE_LABELS,
  PERSON_LABELS,
} from "@/interfaces/pitch-assistant";

import {ToggleGroup} from "@/features/pitch-generation/components/input/ToggleGroup";
import type {GeneratePitchParams} from "@/features/pitch-generation/data/api/useGeneratePitchMutation";

interface GenerateFormValues {
  jd: string;
  directive: string;
  language: Language;
  person: Person;
}

const schema: ObjectSchema<GenerateFormValues> = object({
  jd: string().trim().required("A job description is required"),
  directive: string().defined(),
  language: mixed<Language>().oneOf(["en", "fr"]).required(),
  person: mixed<Person>().oneOf(["first", "third"]).required(),
});

interface GenerateFormProps {
  generating: boolean;
  onGenerate: (params: GeneratePitchParams) => void;
}

export function GenerateForm({generating, onGenerate}: GenerateFormProps) {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<GenerateFormValues>({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      jd: "",
      directive: "",
      language: DEFAULT_LANGUAGE,
      person: DEFAULT_PERSON,
    },
  });

  const jd = useWatch({control, name: "jd"});

  const submit = handleSubmit(values =>
    onGenerate({
      jd: values.jd.trim(),
      directive: values.directive.trim() || undefined,
      language: values.language,
      person: values.person,
    }),
  );

  return (
    <form
      onSubmit={submit}
      className="bg-white border border-slate-200 rounded-lg p-4"
    >
      <div className="mb-3 grid grid-cols-2 gap-4">
        <Controller
          control={control}
          name="language"
          render={({field}) => (
            <ToggleGroup
              label="Language"
              options={LANGUAGE_LABELS}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="person"
          render={({field}) => (
            <ToggleGroup
              label="Person"
              options={PERSON_LABELS}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <p className="mb-3 text-xs text-slate-500">
        Sets the pitch language &amp; voice, and scopes which past pitches and
        rules are used.
      </p>

      <Controller
        control={control}
        name="jd"
        render={({field}) => (
          <textarea
            {...field}
            placeholder="Paste the job description here..."
            className="w-full min-h-[200px] p-3 border border-slate-200 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        )}
      />

      {errors.jd?.message && (
        <p className="mt-1 text-xs text-red-600">{errors.jd.message}</p>
      )}

      <div className="mt-3">
        <label className="block text-xs font-medium text-slate-500 uppercase mb-1">
          Custom directive <span className="normal-case">(optional)</span>
        </label>

        <Controller
          control={control}
          name="directive"
          render={({field}) => (
            <input
              {...field}
              type="text"
              placeholder="e.g. Mainly use my Acme experience, and keep it under 200 words"
              className="w-full p-3 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          )}
        />

        <p className="mt-1 text-xs text-slate-500">
          A one-off instruction for this pitch, applied like a rule.
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-slate-500">{jd.length} characters</span>

        <button
          type="submit"
          disabled={generating || !jd.trim()}
          className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? "Generating..." : "Generate pitch"}
        </button>
      </div>
    </form>
  );
}
