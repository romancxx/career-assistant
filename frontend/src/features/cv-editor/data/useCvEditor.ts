import {useState} from "react";

import type {Cv} from "@/interfaces/cv-pdf";

import {useCvEditorQuery} from "@/features/cv-editor/data/api/useCvEditorQuery";
import {useRenderCvPdfMutation} from "@/features/cv-editor/data/api/useRenderCvPdfMutation";
import {useSaveCvMutation} from "@/features/cv-editor/data/api/useSaveCvMutation";
import {toMessage} from "@/utils/errors";

export function useCvEditor() {
  const {
    data: serverCv,
    error: queryError,
    isPending: loading,
  } = useCvEditorQuery();

  const {
    mutateAsync: saveCv,
    reset: resetSave,
    error: saveError,
    isPending: saving,
    isSuccess: saved,
  } = useSaveCvMutation();

  const {
    mutateAsync: renderPdf,
    error: pdfError,
    isPending: downloading,
  } = useRenderCvPdfMutation();

  const [draft, setDraft] = useState<Cv | null>(null);

  if (serverCv && !draft) setDraft(structuredClone(serverCv));

  const error =
    (queryError && toMessage(queryError)) ||
    (saveError && toMessage(saveError)) ||
    (pdfError && toMessage(pdfError)) ||
    null;

  function update(fn: (d: Cv) => void) {
    resetSave();
    setDraft(prev => {
      if (!prev) return prev;
      const next = structuredClone(prev);
      fn(next);
      return next;
    });
  }

  async function save() {
    if (!draft) return;
    const result = await saveCv(draft);
    setDraft(structuredClone(result));
  }

  async function download() {
    if (!draft) return;
    const blob = await renderPdf(draft);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${draft.basics.name.replace(/\s+/g, "-").toLowerCase()}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return {
    cv: draft,
    loading,
    error,
    saving,
    saved,
    downloading,
    update,
    save,
    download,
  };
}
