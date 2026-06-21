import type {ProfileData} from "@/interfaces/pitch-assistant";

import {ProfileHeader} from "@/features/profile/components/navigation/ProfileHeader";
import {ProfileTabs} from "@/features/profile/components/navigation/ProfileTabs";
import {ExperiencesPanel} from "@/features/profile/components/panel/ExperiencesPanel";
import {PitchesPanel} from "@/features/profile/components/panel/PitchesPanel";
import {RulesPanel} from "@/features/profile/components/panel/RulesPanel";
import {SkillsPanel} from "@/features/profile/components/panel/SkillsPanel";
import type {ProfileTab} from "@/features/profile/data/useProfile";
import {useProfileEditor} from "@/features/profile/data/useProfileEditor";
import {filterByVoice} from "@/features/profile/utils/voice";

export function Profile() {
  const {
    data,
    loading,
    tab,
    langFilter,
    personFilter,
    editingId,
    showForm,
    backup,
    backupPending,
    backupMessage,
    backupError,
    setLangFilter,
    setPersonFilter,
    selectTab,
    startAdding,
    startEditing,
    closeForm,
    handleSave,
    handleDelete,
  } = useProfileEditor();

  if (loading) return <div>Loading...</div>;
  if (!data) return null;

  const visiblePitches = filterByVoice<ProfileData["pitches"][number]>(
    data.pitches,
    langFilter,
    personFilter,
  );
  const visibleRules = filterByVoice<ProfileData["rules"][number]>(
    data.rules,
    langFilter,
    personFilter,
  );

  const tabs: {key: ProfileTab; label: string; count: number}[] = [
    {
      key: "experiences",
      label: "Experiences",
      count: data.experiences.length,
    },
    {key: "skills", label: "Skills", count: data.skills.length},
    {key: "pitches", label: "Pitches", count: data.pitches.length},
    {key: "rules", label: "Rules", count: data.rules.length},
  ];

  return (
    <div className="space-y-6">
      <ProfileHeader
        backupPending={backupPending}
        backupMessage={backupMessage}
        backupError={backupError}
        onBackup={() => backup()}
      />

      <ProfileTabs tabs={tabs} active={tab} onSelect={selectTab} />

      {tab === "experiences" && (
        <ExperiencesPanel
          experiences={data.experiences}
          showForm={showForm}
          editingId={editingId}
          onAdd={startAdding}
          onEdit={startEditing}
          onCancel={closeForm}
          onSave={d => handleSave("experiences", d)}
          onDelete={id => handleDelete("experiences", id)}
        />
      )}

      {tab === "skills" && (
        <SkillsPanel
          skills={data.skills}
          showForm={showForm}
          editingId={editingId}
          onAdd={startAdding}
          onEdit={startEditing}
          onCancel={closeForm}
          onSave={d => handleSave("skills", d)}
          onDelete={id => handleDelete("skills", id)}
        />
      )}

      {tab === "pitches" && (
        <PitchesPanel
          pitches={data.pitches}
          visiblePitches={visiblePitches}
          showForm={showForm}
          editingId={editingId}
          langFilter={langFilter}
          personFilter={personFilter}
          onLangFilterChange={setLangFilter}
          onPersonFilterChange={setPersonFilter}
          onAdd={startAdding}
          onEdit={startEditing}
          onCancel={closeForm}
          onSave={d => handleSave("pitches", d)}
          onDelete={id => handleDelete("pitches", id)}
        />
      )}

      {tab === "rules" && (
        <RulesPanel
          rules={data.rules}
          visibleRules={visibleRules}
          showForm={showForm}
          editingId={editingId}
          langFilter={langFilter}
          personFilter={personFilter}
          onLangFilterChange={setLangFilter}
          onPersonFilterChange={setPersonFilter}
          onAdd={startAdding}
          onEdit={startEditing}
          onCancel={closeForm}
          onSave={d => handleSave("rules", d)}
          onDelete={id => handleDelete("rules", id)}
        />
      )}
    </div>
  );
}
