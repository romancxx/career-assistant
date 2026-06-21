import type {Cv} from "@/interfaces/cv-pdf";

import {Card} from "@/features/cv-editor/components/card/Card";
import {Field} from "@/features/cv-editor/components/input/Field";
import {splitList} from "@/features/cv-editor/utils/strings";

interface Props {
  skills: Cv["skills"];
  update: (fn: (draft: Cv) => void) => void;
}

export function SkillsSection({skills, update}: Props) {
  return (
    <Card title="Skills">
      <div className="space-y-3">
        {skills.map((group, i) => (
          <div key={i} className="flex gap-2 items-end">
            <Field
              label="Category"
              value={group.category}
              onChange={v => update(d => (d.skills[i].category = v))}
            />

            <div className="flex-1">
              <Field
                label="Items (comma-separated)"
                value={group.items.join(", ")}
                onChange={v =>
                  update(d => (d.skills[i].items = splitList(v)))
                }
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
