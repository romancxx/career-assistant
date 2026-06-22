import { useMutation } from "@tanstack/react-query";

import { ApiRoute } from "@/interfaces/api.interface";
import type { GenerationResult, Language, Person } from "@/interfaces/pitch-assistant";

import { client } from "@/lib/client";

export interface GeneratePitchParams {
  jd: string;
  directive?: string;
  language: Language;
  person: Person;
}

export function useGeneratePitchMutation() {
  return useMutation<GenerationResult, Error, GeneratePitchParams>({
    mutationFn: async ({ jd, directive, language, person }) => {
      const { data } = await client.post<GenerationResult>(ApiRoute.Generate, {
        jd,
        directive,
        language,
        person
      });
      return data;
    }
  });
}
