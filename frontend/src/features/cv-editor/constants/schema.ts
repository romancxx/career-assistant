import {
  array,
  boolean,
  lazy,
  mixed,
  object,
  string,
  type AnySchema,
  type ObjectSchema
} from "yup";

import type { Cv } from "@/interfaces/cv-pdf";

const emptyToNull = (v: unknown) => (v === "" ? null : v);

const highlights = array(string().trim().default(""))
  .transform((arr: string[]) => (arr ?? []).filter(Boolean))
  .default([]);

const roleEntrySchema = object({
  kind: mixed<"role">().oneOf(["role"]).required(),
  company: string().trim().required("Company is required"),
  role: string().trim().default(""),
  start: string().trim().default(""),
  end: string().trim().default(""),
  duration: string().trim().optional(),
  tagline: string().trim().optional(),
  highlights
});

const engagementSchema = object({
  client: string().trim().required("Client is required"),
  role: string().trim().default(""),
  duration: string().trim().default(""),
  tagline: string().trim().optional(),
  highlights
});

const groupedExperienceSchema = object({
  kind: mixed<"grouped">().oneOf(["grouped"]).required(),
  title: string().trim().required("Title is required"),
  start: string().trim().default(""),
  end: string().trim().default(""),
  note: string().trim().optional(),
  engagements: array(engagementSchema).min(1, "At least one engagement is required").default([])
});

// The experience array is a discriminated union; pick the member schema by
// `kind` at runtime. yup's static types can't model this, so the final CV
// schema is cast to `ObjectSchema<Cv>` for `useForm<Cv>`.
const experienceEntry = lazy((value: { kind?: string } | undefined) =>
  value?.kind === "grouped" ? groupedExperienceSchema : roleEntrySchema
) as unknown as AnySchema;

export const cvSchema = object({
  label: string().optional(),
  showPhoto: boolean().optional(),
  basics: object({
    name: string().trim().required("Name is required"),
    title: string().trim().default(""),
    email: string().trim().default(""),
    phone: string().transform(emptyToNull).nullable().default(null),
    location: string().transform(emptyToNull).nullable().default(null),
    links: array(
      object({
        label: string().trim().default(""),
        url: string().trim().default("")
      })
    ).default([])
  }).required(),
  summary: string().trim().required("Summary is required"),
  experience: array(experienceEntry).min(1, "At least one experience entry is required").required(),
  projects: array(
    object({
      name: string().trim().required("Name is required"),
      description: string().trim().optional(),
      link: string().trim().optional(),
      highlights
    })
  ).optional(),
  skills: array(
    object({
      category: string().trim().required("Category is required"),
      items: array(string().trim().required()).default([])
    })
  ).default([]),
  education: array(
    object({
      institution: string().trim().required("Institution is required"),
      program: string().trim().default(""),
      start: string().trim().default(""),
      end: string().trim().default(""),
      notes: string().transform(emptyToNull).nullable().default(null)
    })
  ).default([])
}) as unknown as ObjectSchema<Cv>;

export const EMPTY_CV: Cv = {
  basics: { name: "", title: "", email: "", phone: null, location: null, links: [] },
  summary: "",
  experience: [],
  skills: [],
  education: []
};
