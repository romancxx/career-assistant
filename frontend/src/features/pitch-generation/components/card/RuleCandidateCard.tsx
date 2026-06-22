import type { RuleCandidateState } from "@/features/pitch-generation/data/usePitchGenerator";

interface Props {
  candidate: RuleCandidateState;
  onTextChange: (text: string) => void;
  onApprove: () => void;
  onDiscard: () => void;
}

export function RuleCandidateCard(props: Props) {
  const { candidate, onTextChange, onApprove, onDiscard } = props;
  return (
    <div className="border border-slate-200 rounded-md p-3 space-y-2">
      <textarea
        value={candidate.text}
        onChange={(e) => onTextChange(e.target.value)}
        disabled={candidate.status !== "pending"}
        className="w-full p-2 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:bg-slate-50 disabled:text-slate-500"
        rows={2}
      />

      <p className="text-xs text-slate-500">Why: {candidate.reason}</p>

      {candidate.status === "pending" && (
        <div className="flex items-center gap-2">
          <button
            onClick={onApprove}
            className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-medium hover:bg-emerald-700"
          >
            Approve &amp; save rule
          </button>

          <button
            onClick={onDiscard}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-xs font-medium"
          >
            Discard
          </button>
        </div>
      )}

      {candidate.status === "approved" && (
        <span className="text-xs text-emerald-700">Saved to your rules ✓</span>
      )}

      {candidate.status === "discarded" && (
        <span className="text-xs text-slate-500">Discarded</span>
      )}
    </div>
  );
}
