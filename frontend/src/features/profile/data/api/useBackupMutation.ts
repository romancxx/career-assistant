import { useMutation } from "@tanstack/react-query";

import { ApiRoute } from "@/interfaces/api.interface";

import { client } from "@/lib/client";

export interface BackupResult {
  ok: boolean;
  dir: string;
  written: { file: string; count: number }[];
}

export function useBackupMutation() {
  return useMutation<BackupResult, Error, void>({
    mutationFn: async () => {
      const { data } = await client.post<BackupResult>(ApiRoute.IngestBackup);
      return data;
    }
  });
}
