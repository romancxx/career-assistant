import type {Cv} from "@/interfaces/cv-pdf";

import {Card} from "@/features/cv-editor/components/card/Card";
import {Field} from "@/features/cv-editor/components/input/Field";

interface Props {
  education: Cv["education"];
  update: (fn: (draft: Cv) => void) => void;
}

export function EducationSection({education, update}: Props) {
  return (
    <Card title="Education">
      <div className="space-y-4">
        {education.map((edu, i) => (
          <div key={i} className="grid grid-cols-2 gap-3">
            <Field
              label="Institution"
              value={edu.institution}
              onChange={v => update(d => (d.education[i].institution = v))}
            />

            <Field
              label="Program"
              value={edu.program}
              onChange={v => update(d => (d.education[i].program = v))}
            />

            <Field
              label="Start"
              value={edu.start}
              onChange={v => update(d => (d.education[i].start = v))}
            />

            <Field
              label="End"
              value={edu.end}
              onChange={v => update(d => (d.education[i].end = v))}
            />

            <div className="col-span-2">
              <Field
                label="Notes"
                value={edu.notes ?? ""}
                onChange={v =>
                  update(d => (d.education[i].notes = v || null))
                }
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
