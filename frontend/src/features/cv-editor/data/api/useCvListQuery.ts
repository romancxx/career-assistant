import { useQuery } from "@tanstack/react-query";

import { ApiRoute } from "@/interfaces/api.interface";
import type { CvSummary } from "@/interfaces/cv-pdf";

import { client } from "@/lib/client";

export const CV_LIST_KEY = ["cv-list"] as const;

export function useCvListQuery() {
  return useQuery<CvSummary[], Error>({
    queryKey: CV_LIST_KEY,
    queryFn: async () => {
      const { data } = await client.get<CvSummary[]>(ApiRoute.CvPdf);
      return data;
    }
  });
}
