import type {
  ProfileData,
  Skill,
} from "@/interfaces/pitch-assistant";

import {FormCard} from "@/features/profile/components/card/FormCard";
import {SkillRow} from "@/features/profile/components/card/SkillRow";
import {SkillForm} from "@/features/profile/components/form/SkillForm";
import {AddButton} from "@/features/profile/components/input/AddButton";

interface Props {
  skills: ProfileData["skills"];
  showForm: boolean;
  editingId: string | null;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onCancel: () => void;
  onSave: (data: Skill) => Promise<void>;
  onDelete: (id: string) => void;
}

export function SkillsPanel({
  skills,
  showForm,
  editingId,
  onAdd,
  onEdit,
  onCancel,
  onSave,
  onDelete,
}: Props) {
  return (
    <div className="space-y-3">
      {showForm ? (
        <FormCard>
          <SkillForm
            initial={skills.find(s => s.id === editingId)?.payload}
            onSubmit={onSave}
            onCancel={onCancel}
          />
        </FormCard>
      ) : (
        <AddButton label="skill" onClick={onAdd} />
      )}

      <div className="bg-white border border-slate-200 rounded-lg p-4 grid grid-cols-2 md:grid-cols-3 gap-2">
        {skills
          .filter(s => s.id !== editingId)
          .map(s => (
            <SkillRow
              key={s.id}
              skill={s.payload}
              onEdit={() => onEdit(s.id)}
              onDelete={() => onDelete(s.id)}
            />
          ))}
      </div>
    </div>
  );
}
