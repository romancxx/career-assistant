import type { Cv } from "@/interfaces/cv-pdf";

import { useCvEditorQuery } from "@/features/cv-editor/data/api/useCvEditorQuery";
import { useRenderCvPdfMutation } from "@/features/cv-editor/data/api/useRenderCvPdfMutation";
import { useSaveCvMutation } from "@/features/cv-editor/data/api/useSaveCvMutation";
import { toMessage } from "@/utils/errors";

export function useCvEditor(id: string | null) {
  const { data: serverCv, error: queryError, isPending: loading } = useCvEditorQuery(id);

  const {
    mutateAsync: saveCv,
    reset: resetSaved,
    error: saveError,
    isPending: saving,
    isSuccess: saved
  } = useSaveCvMutation(id);

  const {
    mutateAsync: renderPdf,
    error: pdfError,
    isPending: downloading
  } = useRenderCvPdfMutation();

  const error =
    (queryError && toMessage(queryError)) ||
    (saveError && toMessage(saveError)) ||
    (pdfError && toMessage(pdfError)) ||
    null;

  async function download(cv: Cv) {
    const blob = await renderPdf(cv);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `${cv.basics.name.replace(/\s+/g, "-").toLowerCase()}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return {
    serverCv,
    loading,
    error,
    saving,
    saved,
    resetSaved,
    downloading,
    save: saveCv,
    download
  };
}
