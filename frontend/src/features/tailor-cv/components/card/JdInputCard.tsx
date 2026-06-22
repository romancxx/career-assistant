interface Props {
  jd: string;
  loading: boolean;
  onChange: (jd: string) => void;
  onTailor: () => void;
}

export function JdInputCard({ jd, loading, onChange, onTailor }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
      <label className="block text-sm font-medium text-slate-700">Job description</label>

      <textarea
        value={jd}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the job description…"
        className="w-full min-h-[200px] p-3 border border-slate-200 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
      />

      <button
        onClick={onTailor}
        disabled={loading || !jd.trim()}
        className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Tailoring…" : "Tailor CV →"}
      </button>
    </div>
  );
}
