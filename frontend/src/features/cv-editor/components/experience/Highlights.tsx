import {AddBtn} from "@/features/cv-editor/components/input/AddBtn";
import {RemoveBtn} from "@/features/cv-editor/components/input/RemoveBtn";

interface Props {
  items: string[];
  onChange: (fn: (draft: string[]) => void) => void;
}

export function Highlights({items, onChange}: Props) {
  return (
    <div className="mt-3 space-y-2">
      <span className="text-xs font-medium text-slate-500">Highlights</span>

      {items.map((h, i) => (
        <div key={i} className="flex gap-2 items-start">
          <textarea
            className="flex-1 border border-slate-300 rounded px-2 py-1 text-sm"
            rows={2}
            value={h}
            onChange={ev => onChange(d => (d[i] = ev.target.value))}
          />

          <RemoveBtn onClick={() => onChange(d => d.splice(i, 1))} />
        </div>
      ))}

      <AddBtn
        label="Add highlight"
        onClick={() => onChange(d => d.push(""))}
      />
    </div>
  );
}
