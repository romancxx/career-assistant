interface Props {
  keywordsMatched: string[];
  keywordsMissed: string[];
}

export function AtsMatchSection({keywordsMatched, keywordsMissed}: Props) {
  return (
    <section className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
      <h2 className="text-sm font-semibold text-slate-700">ATS Match</h2>

      <div className="flex flex-wrap gap-1.5">
        {keywordsMatched.map(k => (
          <span
            key={k}
            className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs"
          >
            ✓ {k}
          </span>
        ))}

        {keywordsMissed.map(k => (
          <span
            key={k}
            className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-xs"
          >
            ⚠ {k}
          </span>
        ))}
      </div>
    </section>
  );
}
