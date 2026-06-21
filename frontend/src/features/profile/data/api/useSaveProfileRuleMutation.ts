import {useMutation, useQueryClient} from "@tanstack/react-query";

import {ApiRoute} from "@/interfaces/api.interface";
import type {Rule} from "@/interfaces/pitch-assistant";

import {PROFILE_KEY} from "@/features/profile/data/api/useProfileQuery";
import {client} from "@/lib/client";

export interface SaveProfileRuleParams {
  data: Rule;
  id?: string;
}

export function useSaveProfileRuleMutation() {
  const qc = useQueryClient();
  return useMutation<void, Error, SaveProfileRuleParams>({
    mutationFn: async ({data, id}) => {
      if (id) {
        await client.put(`${ApiRoute.IngestRule}/${id}`, data);
      } else {
        await client.post(ApiRoute.IngestRule, data);
      }
    },
    onSuccess: () => qc.invalidateQueries({queryKey: PROFILE_KEY}),
  });
}
