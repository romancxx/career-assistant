import type { GenerationResult } from "@/interfaces/pitch-assistant";

interface Props {
  metadata: GenerationResult["metadata"];
}

export function RetrievalDebug(props: Props) {
  const { metadata } = props;
  return (
    <details className="bg-white border border-slate-200 rounded-lg p-4 text-sm">
      <summary className="cursor-pointer font-medium text-slate-600">Retrieval debug info</summary>

      <pre className="mt-3 text-xs overflow-auto bg-slate-50 p-3 rounded">
        {JSON.stringify(metadata, null, 2)}
      </pre>
    </details>
  );
}
