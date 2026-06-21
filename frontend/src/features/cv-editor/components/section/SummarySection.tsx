import type {Cv} from "@/interfaces/cv-pdf";

import {Card} from "@/features/cv-editor/components/card/Card";
import {Area} from "@/features/cv-editor/components/input/Area";

interface Props {
  summary: string;
  update: (fn: (draft: Cv) => void) => void;
}

export function SummarySection({summary, update}: Props) {
  return (
    <Card title="Summary">
      <Area
        value={summary}
        onChange={v => update(d => (d.summary = v))}
        rows={4}
      />
    </Card>
  );
}
