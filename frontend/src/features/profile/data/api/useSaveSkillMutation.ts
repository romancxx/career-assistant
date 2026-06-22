import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiRoute } from "@/interfaces/api.interface";
import type { Skill } from "@/interfaces/pitch-assistant";

import { PROFILE_KEY } from "@/features/profile/data/api/useProfileQuery";
import { client } from "@/lib/client";

export interface SaveSkillParams {
  data: Skill;
  id?: string;
}

export function useSaveSkillMutation() {
  const qc = useQueryClient();
  return useMutation<void, Error, SaveSkillParams>({
    mutationFn: async ({ data, id }) => {
      if (id) {
        await client.put(`${ApiRoute.IngestSkill}/${id}`, data);
      } else {
        await client.post(ApiRoute.IngestSkill, data);
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: PROFILE_KEY })
  });
}
