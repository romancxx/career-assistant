import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiRoute } from "@/interfaces/api.interface";
import type { Cv, CvSummary } from "@/interfaces/cv-pdf";

import { CV_LIST_KEY } from "@/features/cv-editor/data/api/useCvListQuery";
import { client } from "@/lib/client";

export function useCreateCvMutation() {
  const queryClient = useQueryClient();

  return useMutation<CvSummary, Error, Cv>({
    mutationFn: async (cv) => {
      const { data } = await client.post<CvSummary>(ApiRoute.CvPdf, { cv });
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CV_LIST_KEY });
    }
  });
}
