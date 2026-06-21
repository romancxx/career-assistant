import {useMutation} from "@tanstack/react-query";

import {ApiRoute} from "@/interfaces/api.interface";
import type {Cv} from "@/interfaces/cv-pdf";

import {client} from "@/lib/client";

export function useSaveCvMutation() {
  return useMutation<Cv, Error, Cv>({
    mutationFn: async cv => {
      const {data} = await client.put<Cv>(ApiRoute.CvPdfData, {cv});
      return data;
    },
  });
}
