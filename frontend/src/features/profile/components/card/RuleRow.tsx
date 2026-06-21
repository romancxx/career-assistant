import type {Rule} from "@/interfaces/pitch-assistant";

import {VoiceBadge} from "@/features/profile/components/badge/VoiceBadge";
import {ItemActions} from "@/features/profile/components/input/ItemActions";

interface Props {
  rule: Rule;
  onEdit: () => void;
  onDelete: () => void;
}

export function RuleRow({rule, onEdit, onDelete}: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 text-sm flex items-start justify-between gap-2">
      <div className="flex items-start gap-2">
        <VoiceBadge language={rule.language} person={rule.person} />

        <span>{rule.text}</span>
      </div>

      <div className="flex gap-2 ml-2 shrink-0">
        <ItemActions onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
}
