import { useQuery } from "@tanstack/react-query";

import { ApiRoute } from "@/interfaces/api.interface";
import type { Cv } from "@/interfaces/cv-pdf";

import { client } from "@/lib/client";

export const CV_BY_ID_KEY = (id: string) => ["cv-editor", id] as const;

export function useCvEditorQuery(id: string | null) {
  return useQuery<Cv, Error>({
    queryKey: CV_BY_ID_KEY(id ?? ""),
    enabled: !!id,
    queryFn: async () => {
      const { data } = await client.get<Cv>(`${ApiRoute.CvPdf}/${id}`);
      return data;
    }
  });
}
