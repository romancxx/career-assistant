import type { CvSummary } from "@/interfaces/cv-pdf";

import { AddBtn } from "@/features/cv-editor/components/input/AddBtn";
import { RemoveBtn } from "@/features/cv-editor/components/input/RemoveBtn";

interface Props {
  tabs: CvSummary[];
  activeId: string | null;
  canDelete: boolean;
  creating: boolean;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
}

export function CvTabs({
  tabs,
  activeId,
  canDelete,
  creating,
  onSelect,
  onCreate,
  onDelete
}: Props) {
  return (
    <div className="flex items-center gap-2 border-b border-slate-200">
      {tabs.map((t) => (
        <div
          key={t.id}
          className={`flex items-center border-b-2 ${
            activeId === t.id ? "border-slate-900" : "border-transparent"
          }`}
        >
          <button
            onClick={() => onSelect(t.id)}
            className={`pl-4 py-2 text-sm font-medium ${
              activeId === t.id ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.label}
          </button>

          {canDelete && <RemoveBtn onClick={() => onDelete(t.id)} />}
        </div>
      ))}

      <div className="pl-2">
        <AddBtn label={creating ? "Adding…" : "New CV"} onClick={onCreate} />
      </div>
    </div>
  );
}
