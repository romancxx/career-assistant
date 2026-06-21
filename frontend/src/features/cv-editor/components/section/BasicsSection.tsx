import type {Cv} from "@/interfaces/cv-pdf";

import {Card} from "@/features/cv-editor/components/card/Card";
import {AddBtn} from "@/features/cv-editor/components/input/AddBtn";
import {Field} from "@/features/cv-editor/components/input/Field";
import {RemoveBtn} from "@/features/cv-editor/components/input/RemoveBtn";

interface Props {
  basics: Cv["basics"];
  update: (fn: (draft: Cv) => void) => void;
}

export function BasicsSection({basics, update}: Props) {
  return (
    <Card title="Basics">
      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Name"
          value={basics.name}
          onChange={v => update(d => (d.basics.name = v))}
        />

        <Field
          label="Title"
          value={basics.title}
          onChange={v => update(d => (d.basics.title = v))}
        />

        <Field
          label="Email"
          value={basics.email}
          onChange={v => update(d => (d.basics.email = v))}
        />

        <Field
          label="Phone"
          value={basics.phone ?? ""}
          onChange={v => update(d => (d.basics.phone = v || null))}
        />

        <Field
          label="Location"
          value={basics.location ?? ""}
          onChange={v => update(d => (d.basics.location = v || null))}
        />
      </div>

      <div className="mt-3 space-y-2">
        {basics.links.map((link, i) => (
          <div key={i} className="flex gap-2 items-end">
            <Field
              label="Link label"
              value={link.label}
              onChange={v => update(d => (d.basics.links[i].label = v))}
            />

            <Field
              label="URL"
              value={link.url}
              onChange={v => update(d => (d.basics.links[i].url = v))}
            />

            <RemoveBtn
              onClick={() => update(d => d.basics.links.splice(i, 1))}
            />
          </div>
        ))}

        <AddBtn
          label="Add link"
          onClick={() =>
            update(d => d.basics.links.push({label: "", url: ""}))
          }
        />
      </div>
    </Card>
  );
}
