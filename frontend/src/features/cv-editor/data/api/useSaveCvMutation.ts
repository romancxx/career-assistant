import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiRoute } from "@/interfaces/api.interface";
import type { Cv } from "@/interfaces/cv-pdf";

import { CV_LIST_KEY } from "@/features/cv-editor/data/api/useCvListQuery";
import { client } from "@/lib/client";

export function useSaveCvMutation(id: string | null) {
  const queryClient = useQueryClient();

  return useMutation<Cv, Error, Cv>({
    mutationFn: async (cv) => {
      const { data } = await client.put<Cv>(`${ApiRoute.CvPdf}/${id}`, { cv });
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CV_LIST_KEY });
    }
  });
}
