import { RuleCandidateCard } from "@/features/pitch-generation/components/card/RuleCandidateCard";
import type { RuleCandidateState } from "@/features/pitch-generation/data/usePitchGenerator";

interface Props {
  editing: boolean;
  validating: boolean;
  validated: boolean;
  editedText: string;
  feedback: string;
  deriving: boolean;
  pitchSaved: boolean;
  feedbackError: string | null;
  candidates: RuleCandidateState[] | null;
  onFeedbackChange: (value: string) => void;
  onEditedTextChange: (value: string) => void;
  onValidate: () => void;
  onSaveAndDerive: () => void;
  onStartEditing: () => void;
  onApproveCandidate: (index: number) => void;
  onDiscardCandidate: (index: number) => void;
  onUpdateCandidateText: (index: number, text: string) => void;
}

export function ImproveFuturePitchesSection(props: Props) {
  const {
    editing,
    validating,
    validated,
    editedText,
    feedback,
    deriving,
    pitchSaved,
    feedbackError,
    candidates,
    onValidate,
    onStartEditing,
    onEditedTextChange,
    onFeedbackChange,
    onSaveAndDerive,
    onApproveCandidate,
    onDiscardCandidate,
    onUpdateCandidateText
  } = props;

  return (
    <section className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
      <div>
        <h3 className="font-semibold">Improve future pitches</h3>

        <p className="text-sm text-slate-600">
          Validate this pitch to save it as a future example, or edit it and explain your changes so
          PitchForge can learn reusable rules.
        </p>
      </div>

      {!editing && (
        <div className="flex items-center gap-3">
          <button
            onClick={onValidate}
            disabled={validating || validated}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {validating ? "Saving..." : validated ? "Saved ✓" : "Validate pitch"}
          </button>

          <button
            onClick={onStartEditing}
            disabled={validated}
            className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Edit &amp; give feedback
          </button>

          {validated && <span className="text-xs text-emerald-700">Added to your examples.</span>}
        </div>
      )}

      {editing && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase mb-1">
              Your edited pitch
            </label>

            <textarea
              value={editedText}
              onChange={(e) => onEditedTextChange(e.target.value)}
              className="w-full min-h-[200px] p-3 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase mb-1">
              What did you change, and why?
            </label>

            <textarea
              value={feedback}
              onChange={(e) => onFeedbackChange(e.target.value)}
              placeholder="e.g. Removed the 'fast-paced environments' cliché, switched to first person, led with the logistics project..."
              className="w-full min-h-[100px] p-3 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onSaveAndDerive}
              disabled={deriving || pitchSaved || !editedText.trim()}
              className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deriving ? "Saving & analyzing..." : "Save & derive rules"}
            </button>

            {pitchSaved && (
              <span className="text-xs text-emerald-700">Edited pitch saved as an example.</span>
            )}
          </div>
        </div>
      )}

      {feedbackError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
          {feedbackError}
        </div>
      )}

      {candidates && (
        <div className="space-y-3 pt-2">
          <h4 className="text-sm font-semibold">
            Proposed rules{" "}
            <span className="font-normal text-slate-500">
              — approve to apply them to future pitches
            </span>
          </h4>

          {candidates.length === 0 && (
            <p className="text-sm text-slate-600">
              No reusable rules found in these edits. Your pitch was still saved as an example.
            </p>
          )}

          {candidates.map((c, i) => (
            <RuleCandidateCard
              key={i}
              candidate={c}
              onTextChange={(text) => onUpdateCandidateText(i, text)}
              onApprove={() => onApproveCandidate(i)}
              onDiscard={() => onDiscardCandidate(i)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
