import type { JdAnalysis } from "@/interfaces/pitch-assistant";

interface Props {
  analysis: JdAnalysis;
}

export function JdAnalysisSection(props: Props) {
  const { analysis } = props;
  return (
    <section className="bg-white border border-slate-200 rounded-lg p-5">
      <h3 className="font-semibold mb-3">JD Analysis</h3>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-slate-500 text-xs uppercase mb-1">Role</div>

          <div>{analysis.roleTitle}</div>
        </div>

        <div>
          <div className="text-slate-500 text-xs uppercase mb-1">Tone</div>

          <div>{analysis.tone}</div>
        </div>

        <div>
          <div className="text-slate-500 text-xs uppercase mb-1">Required skills</div>

          <div className="flex flex-wrap gap-1">
            {analysis.requiredSkills.map((s) => (
              <span key={s} className="px-2 py-0.5 bg-slate-100 rounded text-xs">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="text-slate-500 text-xs uppercase mb-1">Nice to have</div>

          <div className="flex flex-wrap gap-1">
            {analysis.niceToHaveSkills.map((s) => (
              <span key={s} className="px-2 py-0.5 bg-slate-100 rounded text-xs">
                {s}
              </span>
            ))}
          </div>
        </div>

        {analysis.redFlags.length > 0 && (
          <div className="col-span-2">
            <div className="text-slate-500 text-xs uppercase mb-1">Things to address</div>

            <ul className="list-disc list-inside text-slate-700">
              {analysis.redFlags.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
