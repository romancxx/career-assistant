import {useState} from "react";

import type {Experience, Language, Person, Pitch, Rule, Skill} from "@/interfaces/pitch-assistant";

import {useProfile, type ProfileTab} from "@/features/profile/data/useProfile";

export type LangFilter = Language | "all";
export type PersonFilter = Person | "all";

export function useProfileEditor() {
  const [tab, setTab] = useState<ProfileTab>("experiences");
  const [langFilter, setLangFilter] = useState<LangFilter>("all");
  const [personFilter, setPersonFilter] = useState<PersonFilter>("all");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const profile = useProfile();

  function selectTab(next: ProfileTab) {
    setTab(next);
    setAdding(false);
    setEditingId(null);
  }

  function startAdding() {
    setEditingId(null);
    setAdding(true);
  }

  function startEditing(id: string) {
    setAdding(false);
    setEditingId(id);
  }

  function closeForm() {
    setAdding(false);
    setEditingId(null);
  }

  async function handleSave(type: ProfileTab, payload: Experience | Skill | Pitch | Rule) {
    const id = editingId ?? undefined;
    switch (type) {
      case "experiences":
        await profile.saveExperienceAsync({data: payload as Experience, id});
        break;
      case "skills":
        await profile.saveSkillAsync({data: payload as Skill, id});
        break;
      case "pitches":
        await profile.savePitchAsync({data: payload as Pitch, id});
        break;
      case "rules":
        await profile.saveRuleAsync({data: payload as Rule, id});
        break;
    }
    closeForm();
  }

  async function handleDelete(type: ProfileTab, id: string) {
    if (!confirm("Delete this item? This can't be undone.")) return;
    switch (type) {
      case "experiences":
        await profile.deleteExperienceAsync(id);
        break;
      case "skills":
        await profile.deleteSkillAsync(id);
        break;
      case "pitches":
        await profile.deletePitchAsync(id);
        break;
      case "rules":
        await profile.deleteRuleAsync(id);
        break;
    }
    if (editingId === id) closeForm();
  }

  return {
    ...profile,
    tab,
    langFilter,
    personFilter,
    adding,
    editingId,
    showForm: adding || editingId !== null,
    setLangFilter,
    setPersonFilter,
    selectTab,
    startAdding,
    startEditing,
    closeForm,
    handleSave,
    handleDelete,
  };
}
