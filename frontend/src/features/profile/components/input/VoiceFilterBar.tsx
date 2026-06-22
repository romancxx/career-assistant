import type { Language, Person } from "@/interfaces/pitch-assistant";
import { LANGUAGE_LABELS, PERSON_LABELS } from "@/interfaces/pitch-assistant";

import type { LangFilter, PersonFilter } from "@/features/profile/data/useProfileEditor";

interface Props {
  langFilter: LangFilter;
  personFilter: PersonFilter;
  onLangFilterChange: (value: LangFilter) => void;
  onPersonFilterChange: (value: PersonFilter) => void;
}

export function VoiceFilterBar({
  langFilter,
  personFilter,
  onLangFilterChange,
  onPersonFilterChange
}: Props) {
  return (
    <div className="flex gap-4 flex-wrap">
      <div className="flex gap-1 items-center">
        <span className="text-xs text-slate-500 mr-1">Language:</span>

        {(["all", ...Object.keys(LANGUAGE_LABELS)] as LangFilter[]).map((l) => (
          <button
            key={l}
            onClick={() => onLangFilterChange(l)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
              langFilter === l
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
            }`}
          >
            {l === "all" ? "All" : LANGUAGE_LABELS[l as Language]}
          </button>
        ))}
      </div>

      <div className="flex gap-1 items-center">
        <span className="text-xs text-slate-500 mr-1">Person:</span>

        {(["all", ...Object.keys(PERSON_LABELS)] as PersonFilter[]).map((p) => (
          <button
            key={p}
            onClick={() => onPersonFilterChange(p)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
              personFilter === p
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
            }`}
          >
            {p === "all" ? "All" : PERSON_LABELS[p as Person]}
          </button>
        ))}
      </div>
    </div>
  );
}
