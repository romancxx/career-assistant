import {useMutation} from "@tanstack/react-query";

import {ApiRoute} from "@/interfaces/api.interface";
import type {Pitch} from "@/interfaces/pitch-assistant";

import {client} from "@/lib/client";

export function useSavePitchMutation() {
  return useMutation<void, Error, Pitch>({
    mutationFn: async pitch => {
      await client.post(ApiRoute.IngestPitch, pitch);
    },
  });
}
