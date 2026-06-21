import {useQuery} from "@tanstack/react-query";

import {ApiRoute} from "@/interfaces/api.interface";
import type {Cv} from "@/interfaces/cv-pdf";

import {client} from "@/lib/client";

export const CV_EDITOR_KEY = ["cv-editor"] as const;

export function useCvEditorQuery() {
  return useQuery<Cv, Error>({
    queryKey: CV_EDITOR_KEY,
    queryFn: async () => {
      const {data} = await client.get<Cv>(ApiRoute.CvPdfData);
      return data;
    },
  });
}
