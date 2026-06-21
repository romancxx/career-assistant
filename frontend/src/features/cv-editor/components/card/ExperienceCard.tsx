import type {
  ExperienceEntry,
  RoleEntry,
  GroupedExperience,
} from "@/interfaces/cv-pdf";

import {EngagementCard} from "@/features/cv-editor/components/card/EngagementCard";
import {Highlights} from "@/features/cv-editor/components/experience/Highlights";
import {Field} from "@/features/cv-editor/components/input/Field";

interface Props {
  entry: ExperienceEntry;
  onChange: (fn: (draft: ExperienceEntry) => void) => void;
}

export function ExperienceCard({entry, onChange}: Props) {
  if (entry.kind === "role") {
    const e = entry;
    return (
      <div className="border border-slate-200 rounded-md p-4 bg-white">
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Company"
            value={e.company}
            onChange={v => onChange(d => ((d as RoleEntry).company = v))}
          />

          <Field
            label="Role"
            value={e.role}
            onChange={v => onChange(d => ((d as RoleEntry).role = v))}
          />

          <Field
            label="Start"
            value={e.start}
            onChange={v => onChange(d => ((d as RoleEntry).start = v))}
          />

          <Field
            label="End"
            value={e.end}
            onChange={v => onChange(d => ((d as RoleEntry).end = v))}
          />
        </div>

        <div className="mt-3">
          <Field
            label="Tagline"
            value={e.tagline ?? ""}
            onChange={v =>
              onChange(d => ((d as RoleEntry).tagline = v || undefined))
            }
          />
        </div>

        <Highlights
          items={e.highlights}
          onChange={fn => onChange(d => fn((d as RoleEntry).highlights))}
        />
      </div>
    );
  }

  const g = entry;
  return (
    <div className="border border-slate-200 rounded-md p-4 bg-white">
      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Title"
          value={g.title}
          onChange={v =>
            onChange(d => ((d as GroupedExperience).title = v))
          }
        />

        <div />

        <Field
          label="Start"
          value={g.start}
          onChange={v =>
            onChange(d => ((d as GroupedExperience).start = v))
          }
        />

        <Field
          label="End"
          value={g.end}
          onChange={v => onChange(d => ((d as GroupedExperience).end = v))}
        />
      </div>

      <div className="mt-3">
        <Field
          label="Note"
          value={g.note ?? ""}
          onChange={v =>
            onChange(d => ((d as GroupedExperience).note = v || undefined))
          }
        />
      </div>

      <div className="mt-4 space-y-4 pl-4 border-l-2 border-slate-100">
        {g.engagements.map((eng, i) => (
          <EngagementCard
            key={i}
            engagement={eng}
            onChange={fn =>
              onChange(d => fn((d as GroupedExperience).engagements[i]))
            }
          />
        ))}
      </div>
    </div>
  );
}
