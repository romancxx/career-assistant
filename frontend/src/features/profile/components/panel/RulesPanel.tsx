import type { ProfileData, Rule } from "@/interfaces/pitch-assistant";

import { FormCard } from "@/features/profile/components/card/FormCard";
import { RuleRow } from "@/features/profile/components/card/RuleRow";
import { RuleForm } from "@/features/profile/components/form/RuleForm";
import { AddButton } from "@/features/profile/components/input/AddButton";
import { VoiceFilterBar } from "@/features/profile/components/input/VoiceFilterBar";
import type { LangFilter, PersonFilter } from "@/features/profile/data/useProfileEditor";

interface Props {
  rules: ProfileData["rules"];
  visibleRules: ProfileData["rules"];
  showForm: boolean;
  editingId: string | null;
  langFilter: LangFilter;
  personFilter: PersonFilter;
  onLangFilterChange: (value: LangFilter) => void;
  onPersonFilterChange: (value: PersonFilter) => void;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onCancel: () => void;
  onSave: (data: Rule) => Promise<void>;
  onDelete: (id: string) => void;
}

export function RulesPanel({
  rules,
  visibleRules,
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
          <RuleForm
            initial={rules.find((r) => r.id === editingId)?.payload}
            onSubmit={onSave}
            onCancel={onCancel}
          />
        </FormCard>
      ) : (
        <AddButton label="rule" onClick={onAdd} />
      )}

      {visibleRules
        .filter((r) => r.id !== editingId)
        .map((r) => (
          <RuleRow
            key={r.id}
            rule={r.payload}
            onEdit={() => onEdit(r.id)}
            onDelete={() => onDelete(r.id)}
          />
        ))}
    </div>
  );
}
