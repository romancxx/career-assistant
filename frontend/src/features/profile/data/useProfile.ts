import { useBackupMutation } from "@/features/profile/data/api/useBackupMutation";
import { useDeleteExperienceMutation } from "@/features/profile/data/api/useDeleteExperienceMutation";
import { useDeleteProfilePitchMutation } from "@/features/profile/data/api/useDeleteProfilePitchMutation";
import { useDeleteProfileRuleMutation } from "@/features/profile/data/api/useDeleteProfileRuleMutation";
import { useDeleteSkillMutation } from "@/features/profile/data/api/useDeleteSkillMutation";
import { useProfileQuery } from "@/features/profile/data/api/useProfileQuery";
import { useSaveExperienceMutation } from "@/features/profile/data/api/useSaveExperienceMutation";
import { useSaveProfilePitchMutation } from "@/features/profile/data/api/useSaveProfilePitchMutation";
import { useSaveProfileRuleMutation } from "@/features/profile/data/api/useSaveProfileRuleMutation";
import { useSaveSkillMutation } from "@/features/profile/data/api/useSaveSkillMutation";

export type ProfileTab = "experiences" | "skills" | "pitches" | "rules";

export function useProfile() {
  const { data = null, isPending: loading } = useProfileQuery();

  const { mutateAsync: saveExperienceAsync } = useSaveExperienceMutation();
  const { mutateAsync: deleteExperienceAsync } = useDeleteExperienceMutation();
  const { mutateAsync: saveSkillAsync } = useSaveSkillMutation();
  const { mutateAsync: deleteSkillAsync } = useDeleteSkillMutation();
  const { mutateAsync: savePitchAsync } = useSaveProfilePitchMutation();
  const { mutateAsync: deletePitchAsync } = useDeleteProfilePitchMutation();
  const { mutateAsync: saveRuleAsync } = useSaveProfileRuleMutation();
  const { mutateAsync: deleteRuleAsync } = useDeleteProfileRuleMutation();

  const {
    data: backupData,
    error: backupError,
    mutate: backup,
    isPending: backupPending
  } = useBackupMutation();

  const backupMessage = backupData
    ? `Saved ${backupData.written.reduce((s, w) => s + w.count, 0)} items to ${backupData.dir}`
    : backupError
      ? "Backup failed — is the backend running?"
      : null;

  return {
    data,
    loading,
    backupPending,
    backupMessage,
    backupError: !!backupError,
    saveExperienceAsync,
    deleteExperienceAsync,
    saveSkillAsync,
    deleteSkillAsync,
    savePitchAsync,
    deletePitchAsync,
    saveRuleAsync,
    deleteRuleAsync,
    backup
  };
}
