import { useState } from "react";

import type { Cv } from "@/interfaces/cv-pdf";

import { useCreateCvMutation } from "@/features/cv-editor/data/api/useCreateCvMutation";
import { useCvListQuery } from "@/features/cv-editor/data/api/useCvListQuery";
import { useDeleteCvMutation } from "@/features/cv-editor/data/api/useDeleteCvMutation";
import { toMessage } from "@/utils/errors";

export function useCvWorkspace() {
  const { data: cvs = [], error: listError, isPending: loading } = useCvListQuery();

  const { mutateAsync: createCv, error: createError, isPending: creating } = useCreateCvMutation();

  const { mutateAsync: deleteCv, error: deleteError, isPending: deleting } = useDeleteCvMutation();

  const [activeId, setActiveId] = useState<string | null>(null);

  // Keep a valid active tab as the list loads or shrinks.
  if (cvs.length && (!activeId || !cvs.some((c) => c.id === activeId))) {
    setActiveId(cvs[0].id);
  }

  const error =
    (listError && toMessage(listError)) ||
    (createError && toMessage(createError)) ||
    (deleteError && toMessage(deleteError)) ||
    null;

  async function create(source: Cv) {
    const label = source.label?.trim() || source.basics.title;
    const clone: Cv = { ...structuredClone(source), label: `Copy of ${label}` };
    const created = await createCv(clone);

    setActiveId(created.id);
  }

  async function remove(id: string) {
    if (cvs.length <= 1) return;
    await deleteCv(id);
    if (id === activeId) {
      const next = cvs.find((c) => c.id !== id);
      setActiveId(next ? next.id : null);
    }
  }

  return {
    cvs,
    activeId,
    loading,
    error,
    creating,
    deleting,
    canDelete: cvs.length > 1,
    select: setActiveId,
    create,
    remove
  };
}
