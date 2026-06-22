import type { Pitch } from "@/interfaces/pitch-assistant";

import { VoiceBadge } from "@/features/profile/components/badge/VoiceBadge";
import { ItemActions } from "@/features/profile/components/input/ItemActions";

interface Props {
  pitch: Pitch;
  onEdit: () => void;
  onDelete: () => void;
}

export function PitchCard({ pitch, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="text-xs text-slate-500 mb-2 flex items-center gap-2">
          <VoiceBadge language={pitch.language} person={pitch.person} />

          <span>
            {pitch.roleType ?? "No role type"} · {pitch.tags?.join(", ")}
          </span>
        </div>

        <div className="flex gap-2 ml-2 shrink-0">
          <ItemActions onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>

      <p className="text-sm whitespace-pre-wrap">{pitch.text}</p>
    </div>
  );
}
