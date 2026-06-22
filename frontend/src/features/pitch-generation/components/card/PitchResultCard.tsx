import type { GeneratedPitch } from "@/interfaces/pitch-assistant";

interface Props {
  pitch: GeneratedPitch;
}

export function PitchResultCard(props: Props) {
  const { pitch } = props;
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Your pitch</h3>

        <span className="text-xs text-slate-500">{pitch.wordCount} words</span>
      </div>

      <p className="whitespace-pre-wrap text-sm text-slate-800 flex-1">{pitch.text}</p>

      <div className="mt-4 pt-4 border-t border-slate-100 text-xs space-y-2">
        <div>
          <span className="text-slate-500">Based on: </span>

          <span className="text-slate-700">{pitch.usedExperiences.join(", ") || "—"}</span>
        </div>

        <div>
          <span className="text-slate-500">Mentions: </span>

          <span className="text-slate-700">{pitch.usedSkills.join(", ") || "—"}</span>
        </div>
      </div>

      <button
        onClick={() => navigator.clipboard.writeText(pitch.text)}
        className="mt-3 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-xs font-medium self-start"
      >
        Copy
      </button>
    </div>
  );
}
