import { useState } from "react";
import type {
  Experience,
  JobType,
  Pitch,
  Platform,
  Rule,
  Skill
} from "../interfaces/pitch-assistant";
import { PLATFORM_LABELS } from "../interfaces/pitch-assistant";

const PLATFORM_OPTIONS = Object.keys(PLATFORM_LABELS) as Platform[];

const inputClass =
  "w-full border border-slate-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400";
const labelClass = "block text-xs font-medium text-slate-500 mb-1";

function Field({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

function FormActions({
  onCancel,
  submitting
}: {
  onCancel: () => void;
  submitting: boolean;
}) {
  return (
    <div className="flex gap-2 pt-1">
      <button
        type="submit"
        disabled={submitting}
        className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800 disabled:opacity-50"
      >
        {submitting ? "Saving..." : "Save"}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-xs font-medium"
      >
        Cancel
      </button>
    </div>
  );
}

const toLines = (v: string) =>
  v
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

const toList = (v: string) =>
  v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export function ExperienceForm({
  initial,
  onSubmit,
  onCancel
}: {
  initial?: Experience;
  onSubmit: (data: Experience) => Promise<void>;
  onCancel: () => void;
}) {
  const [companyName, setCompanyName] = useState(initial?.companyName ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [jobType, setJobType] = useState<JobType>(
    initial?.jobType ?? "full-time"
  );
  const [startDate, setStartDate] = useState(initial?.startDate ?? "");
  const [endDate, setEndDate] = useState(initial?.endDate ?? "");
  const [companyDescription, setCompanyDescription] = useState(
    initial?.companyDescription ?? ""
  );
  const [stack, setStack] = useState((initial?.stack ?? []).join(", "));
  const [achievements, setAchievements] = useState(
    (initial?.achievements ?? []).join("\n")
  );
  const [context, setContext] = useState(initial?.context ?? "");
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        companyName: companyName.trim(),
        role: role.trim(),
        jobType,
        startDate: startDate.trim(),
        endDate: endDate.trim() || undefined,
        companyDescription: companyDescription.trim() || undefined,
        stack: toList(stack),
        achievements: toLines(achievements),
        context: context.trim() || undefined
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Company">
          <input
            className={inputClass}
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </Field>
        <Field label="Role">
          <input
            className={inputClass}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
        </Field>
        <Field label="Job type">
          <select
            className={inputClass}
            value={jobType}
            onChange={(e) => setJobType(e.target.value as JobType)}
          >
            <option value="full-time">full-time</option>
            <option value="contract">contract</option>
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Start (YYYY-MM)">
            <input
              className={inputClass}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="2024-01"
              required
            />
          </Field>
          <Field label="End (blank = present)">
            <input
              className={inputClass}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="2024-12"
            />
          </Field>
        </div>
      </div>
      <Field label="Company description">
        <input
          className={inputClass}
          value={companyDescription}
          onChange={(e) => setCompanyDescription(e.target.value)}
        />
      </Field>
      <Field label="Stack (comma-separated)">
        <input
          className={inputClass}
          value={stack}
          onChange={(e) => setStack(e.target.value)}
          placeholder="TypeScript, NestJS, Postgres"
        />
      </Field>
      <Field label="Achievements (one per line)">
        <textarea
          className={inputClass}
          rows={4}
          value={achievements}
          onChange={(e) => setAchievements(e.target.value)}
        />
      </Field>
      <Field label="Context">
        <input
          className={inputClass}
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Industry: ..."
        />
      </Field>
      <FormActions onCancel={onCancel} submitting={submitting} />
    </form>
  );
}

export function SkillForm({
  initial,
  onSubmit,
  onCancel
}: {
  initial?: Skill;
  onSubmit: (data: Skill) => Promise<void>;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [level, setLevel] = useState<Skill["level"]>(
    initial?.level ?? "competent"
  );
  const [years, setYears] = useState(
    initial?.yearsOfExperience?.toString() ?? ""
  );
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        level,
        yearsOfExperience: years.trim() ? Number(years) : undefined
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-3 gap-3 items-end">
      <Field label="Name">
        <input
          className={inputClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </Field>
      <Field label="Level">
        <select
          className={inputClass}
          value={level}
          onChange={(e) => setLevel(e.target.value as Skill["level"])}
        >
          <option value="expert">expert</option>
          <option value="strong">strong</option>
          <option value="competent">competent</option>
        </select>
      </Field>
      <Field label="Years">
        <input
          type="number"
          min="0"
          className={inputClass}
          value={years}
          onChange={(e) => setYears(e.target.value)}
        />
      </Field>
      <div className="col-span-3">
        <FormActions onCancel={onCancel} submitting={submitting} />
      </div>
    </form>
  );
}

export function PitchForm({
  initial,
  onSubmit,
  onCancel
}: {
  initial?: Pitch;
  onSubmit: (data: Pitch) => Promise<void>;
  onCancel: () => void;
}) {
  const [text, setText] = useState(initial?.text ?? "");
  const [roleType, setRoleType] = useState(initial?.roleType ?? "");
  const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
  const [platform, setPlatform] = useState<Platform>(
    initial?.platform ?? "toptal"
  );
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        text: text.trim(),
        roleType: roleType.trim() || undefined,
        tags: toList(tags),
        platform
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <Field label="Pitch text">
        <textarea
          className={inputClass}
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Role type">
          <input
            className={inputClass}
            value={roleType}
            onChange={(e) => setRoleType(e.target.value)}
            placeholder="Senior Backend Engineer"
          />
        </Field>
        <Field label="Tags (comma-separated)">
          <input
            className={inputClass}
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </Field>
        <Field label="Platform">
          <select
            className={inputClass}
            value={platform}
            onChange={(e) => setPlatform(e.target.value as Platform)}
          >
            {PLATFORM_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {PLATFORM_LABELS[p]}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <FormActions onCancel={onCancel} submitting={submitting} />
    </form>
  );
}

export function RuleForm({
  initial,
  onSubmit,
  onCancel
}: {
  initial?: Rule;
  onSubmit: (data: Rule) => Promise<void>;
  onCancel: () => void;
}) {
  const [text, setText] = useState(initial?.text ?? "");
  const [platform, setPlatform] = useState<Platform>(
    initial?.platform ?? "toptal"
  );
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ text: text.trim(), platform });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <Field label="Rule">
        <textarea
          className={inputClass}
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
      </Field>
      <Field label="Platform">
        <select
          className={inputClass}
          value={platform}
          onChange={(e) => setPlatform(e.target.value as Platform)}
        >
          {PLATFORM_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {PLATFORM_LABELS[p]}
            </option>
          ))}
        </select>
      </Field>
      <FormActions onCancel={onCancel} submitting={submitting} />
    </form>
  );
}
