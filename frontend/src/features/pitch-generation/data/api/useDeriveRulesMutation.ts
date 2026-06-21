import {useMutation} from "@tanstack/react-query";

import {ApiRoute} from "@/interfaces/api.interface";
import type {CandidateRule, DeriveRulesRequest, RuleDerivationResult} from "@/interfaces/pitch-assistant";

import {client} from "@/lib/client";

export function useDeriveRulesMutation() {
  return useMutation<CandidateRule[], Error, DeriveRulesRequest>({
    mutationFn: async params => {
      const {data} = await client.post<RuleDerivationResult>(ApiRoute.DeriveRules, params);
      return data.rules;
    },
  });
}
