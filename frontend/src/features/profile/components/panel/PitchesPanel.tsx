import type { Pitch, ProfileData } from "@/interfaces/pitch-assistant";

import { FormCard } from "@/features/profile/components/card/FormCard";
import { PitchCard } from "@/features/profile/components/card/PitchCard";
import { PitchForm } from "@/features/profile/components/form/PitchForm";
import { AddButton } from "@/features/profile/components/input/AddButton";
import { VoiceFilterBar } from "@/features/profile/components/input/VoiceFilterBar";
import type { LangFilter, PersonFilter } from "@/features/profile/data/useProfileEditor";

interface Props {
  pitches: ProfileData["pitches"];
  visiblePitches: ProfileData["pitches"];
  showForm: boolean;
  editingId: string | null;
  langFilter: LangFilter;
  personFilter: PersonFilter;
  onLangFilterChange: (value: LangFilter) => void;
  onPersonFilterChange: (value: PersonFilter) => void;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onCancel: () => void;
  onSave: (data: Pitch) => Promise<void>;
  onDelete: (id: string) => void;
}

export function PitchesPanel({
  pitches,
  visiblePitches,
  showForm,
  editingId,
  langFilter,
  personFilter,
  onLangFilterChange,
  onPersonFilterChange,
  onAdd,
  onEdit,
  onCancel,
  onSave,
  onDelete
}: Props) {
  return (
    <div className="space-y-3">
      <VoiceFilterBar
        langFilter={langFilter}
        personFilter={personFilter}
        onLangFilterChange={onLangFilterChange}
        onPersonFilterChange={onPersonFilterChange}
      />

      {showForm ? (
        <FormCard>
          <PitchForm
            initial={pitches.find((p) => p.id === editingId)?.payload}
            onSubmit={onSave}
            onCancel={onCancel}
          />
        </FormCard>
      ) : (
        <AddButton label="pitch" onClick={onAdd} />
      )}

      {visiblePitches
        .filter((p) => p.id !== editingId)
        .map((p) => (
          <PitchCard
            key={p.id}
            pitch={p.payload}
            onEdit={() => onEdit(p.id)}
            onDelete={() => onDelete(p.id)}
          />
        ))}
    </div>
  );
}
