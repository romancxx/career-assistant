import {useQuery} from "@tanstack/react-query";

import {ApiRoute} from "@/interfaces/api.interface";
import type {ProfileData} from "@/interfaces/pitch-assistant";

import {client} from "@/lib/client";

export const PROFILE_KEY = ["profile"] as const;

export function useProfileQuery() {
  return useQuery<ProfileData, Error>({
    queryKey: PROFILE_KEY,
    queryFn: async () => {
      const {data} = await client.get<ProfileData>(ApiRoute.IngestAll);
      return data;
    },
  });
}
