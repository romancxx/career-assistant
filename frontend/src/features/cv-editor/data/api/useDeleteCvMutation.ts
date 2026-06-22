import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiRoute } from "@/interfaces/api.interface";

import { CV_LIST_KEY } from "@/features/cv-editor/data/api/useCvListQuery";
import { client } from "@/lib/client";

export function useDeleteCvMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await client.delete(`${ApiRoute.CvPdf}/${id}`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CV_LIST_KEY });
    }
  });
}
