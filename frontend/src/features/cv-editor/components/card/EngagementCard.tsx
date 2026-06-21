import type {Engagement} from "@/interfaces/cv-pdf";

import {Highlights} from "@/features/cv-editor/components/experience/Highlights";
import {Field} from "@/features/cv-editor/components/input/Field";

interface Props {
  engagement: Engagement;
  onChange: (fn: (draft: Engagement) => void) => void;
}

export function EngagementCard({engagement, onChange}: Props) {
  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        <Field
          label="Client"
          value={engagement.client}
          onChange={v => onChange(d => (d.client = v))}
        />

        <Field
          label="Role"
          value={engagement.role}
          onChange={v => onChange(d => (d.role = v))}
        />

        <Field
          label="Duration"
          value={engagement.duration}
          onChange={v => onChange(d => (d.duration = v))}
        />
      </div>

      <div className="mt-3">
        <Field
          label="Tagline"
          value={engagement.tagline ?? ""}
          onChange={v => onChange(d => (d.tagline = v || undefined))}
        />
      </div>

      <Highlights
        items={engagement.highlights}
        onChange={fn => onChange(d => fn(d.highlights))}
      />
    </div>
  );
}
