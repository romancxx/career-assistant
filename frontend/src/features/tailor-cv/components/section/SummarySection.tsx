import {CopyButton} from "@/features/tailor-cv/components/input/CopyButton";

interface Props {
  summary: string;
}

export function SummarySection({summary}: Props) {
  return (
    <section className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">Summary</h2>

        <CopyButton text={summary} />
      </div>

      <p className="text-sm text-slate-700 leading-relaxed">{summary}</p>
    </section>
  );
}
