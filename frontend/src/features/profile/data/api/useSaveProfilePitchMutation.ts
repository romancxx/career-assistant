import {useMutation, useQueryClient} from "@tanstack/react-query";

import {ApiRoute} from "@/interfaces/api.interface";
import type {Pitch} from "@/interfaces/pitch-assistant";

import {PROFILE_KEY} from "@/features/profile/data/api/useProfileQuery";
import {client} from "@/lib/client";

export interface SaveProfilePitchParams {
  data: Pitch;
  id?: string;
}

export function useSaveProfilePitchMutation() {
  const qc = useQueryClient();
  return useMutation<void, Error, SaveProfilePitchParams>({
    mutationFn: async ({data, id}) => {
      if (id) {
        await client.put(`${ApiRoute.IngestPitch}/${id}`, data);
      } else {
        await client.post(ApiRoute.IngestPitch, data);
      }
    },
    onSuccess: () => qc.invalidateQueries({queryKey: PROFILE_KEY}),
  });
}
