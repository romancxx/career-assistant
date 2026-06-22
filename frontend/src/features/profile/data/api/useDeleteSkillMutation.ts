import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiRoute } from "@/interfaces/api.interface";

import { PROFILE_KEY } from "@/features/profile/data/api/useProfileQuery";
import { client } from "@/lib/client";

export function useDeleteSkillMutation() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await client.delete(`${ApiRoute.IngestSkill}/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: PROFILE_KEY })
  });
}
