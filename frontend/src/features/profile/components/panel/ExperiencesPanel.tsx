import type { Experience, ProfileData } from "@/interfaces/pitch-assistant";

import { ExperienceCard } from "@/features/profile/components/card/ExperienceCard";
import { FormCard } from "@/features/profile/components/card/FormCard";
import { ExperienceForm } from "@/features/profile/components/form/ExperienceForm";
import { AddButton } from "@/features/profile/components/input/AddButton";

interface Props {
  experiences: ProfileData["experiences"];
  showForm: boolean;
  editingId: string | null;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onCancel: () => void;
  onSave: (data: Experience) => Promise<void>;
  onDelete: (id: string) => void;
}

export function ExperiencesPanel({
  experiences,
  showForm,
  editingId,
  onAdd,
  onEdit,
  onCancel,
  onSave,
  onDelete
}: Props) {
  return (
    <div className="space-y-3">
      {showForm ? (
        <FormCard>
          <ExperienceForm
            initial={experiences.find((e) => e.id === editingId)?.payload}
            onSubmit={onSave}
            onCancel={onCancel}
          />
        </FormCard>
      ) : (
        <AddButton label="experience" onClick={onAdd} />
      )}

      {experiences
        .filter((e) => e.id !== editingId)
        .map((e) => (
          <ExperienceCard
            key={e.id}
            experience={e.payload}
            onEdit={() => onEdit(e.id)}
            onDelete={() => onDelete(e.id)}
          />
        ))}
    </div>
  );
}
