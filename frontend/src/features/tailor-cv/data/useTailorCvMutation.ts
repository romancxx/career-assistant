import {useMutation} from "@tanstack/react-query";

import {ApiRoute} from "@/interfaces/api.interface";
import type {CvDocument} from "@/interfaces/pitch-assistant";

import {client} from "@/lib/client";

export function useTailorCvMutation() {
  return useMutation<CvDocument, Error, string>({
    mutationFn: async jd => {
      const {data} = await client.post<CvDocument>(ApiRoute.CvTailor, {jd});
      return data;
    },
  });
}
