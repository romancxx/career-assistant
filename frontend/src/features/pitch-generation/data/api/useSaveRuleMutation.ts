import {useMutation} from "@tanstack/react-query";

import {ApiRoute} from "@/interfaces/api.interface";
import type {Rule} from "@/interfaces/pitch-assistant";

import {client} from "@/lib/client";

export function useSaveRuleMutation() {
  return useMutation<void, Error, Rule>({
    mutationFn: async rule => {
      await client.post(ApiRoute.IngestRule, rule);
    },
  });
}
