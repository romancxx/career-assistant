import type {Experience} from "@/interfaces/pitch-assistant";

import {ItemActions} from "@/features/profile/components/input/ItemActions";

interface Props {
  experience: Experience;
  onEdit: () => void;
  onDelete: () => void;
}

export function ExperienceCard({experience, onEdit, onDelete}: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="font-semibold">
          {experience.role} @ {experience.companyName}
        </div>

        <div className="flex gap-2 ml-2 shrink-0">
          <ItemActions onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>

      <div className="text-xs text-slate-500 mb-2">
        {experience.startDate} → {experience.endDate ?? "present"}
      </div>

      <div className="flex flex-wrap gap-1 mb-2">
        {experience.stack?.map(s => (
          <span key={s} className="px-2 py-0.5 bg-slate-100 rounded text-xs">
            {s}
          </span>
        ))}
      </div>

      <ul className="list-disc list-inside text-sm text-slate-700">
        {experience.achievements?.map((a, i) => (
          <li key={i}>{a}</li>
        ))}
      </ul>
    </div>
  );
}
