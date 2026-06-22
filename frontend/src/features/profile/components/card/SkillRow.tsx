import type { Skill } from "@/interfaces/pitch-assistant";

import { ItemActions } from "@/features/profile/components/input/ItemActions";

interface Props {
  skill: Skill;
  onEdit: () => void;
  onDelete: () => void;
}

export function SkillRow({ skill, onEdit, onDelete }: Props) {
  return (
    <div className="group flex items-center justify-between text-sm">
      <span>
        <span className="font-medium">{skill.name}</span>

        <span className="text-xs text-slate-500 ml-2">
          {skill.level}

          {skill.yearsOfExperience ? `, ${skill.yearsOfExperience}y` : ""}
        </span>
      </span>

      <span className="flex gap-2 ml-2 shrink-0 opacity-0 group-hover:opacity-100">
        <ItemActions onEdit={onEdit} onDelete={onDelete} />
      </span>
    </div>
  );
}
