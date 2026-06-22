import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiRoute } from "@/interfaces/api.interface";
import type { Experience } from "@/interfaces/pitch-assistant";

import { PROFILE_KEY } from "@/features/profile/data/api/useProfileQuery";
import { client } from "@/lib/client";

export interface SaveExperienceParams {
  data: Experience;
  id?: string;
}

export function useSaveExperienceMutation() {
  const qc = useQueryClient();
  return useMutation<void, Error, SaveExperienceParams>({
    mutationFn: async ({ data, id }) => {
      if (id) {
        await client.put(`${ApiRoute.IngestExperience}/${id}`, data);
      } else {
        await client.post(ApiRoute.IngestExperience, data);
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: PROFILE_KEY })
  });
}
