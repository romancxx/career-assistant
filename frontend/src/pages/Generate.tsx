import { useState } from "react";
import axios from "axios";
import { apiClient } from "../api/client";
import type {
  GenerationResult,
  CandidateRule,
  Platform,
} from "../interfaces/pitch-assistant";
import { PLATFORM_LABELS } from "../interfaces/pitch-assistant";

type SaveState = "idle" | "saving" | "saved" | "error";

// A derived rule plus the local editing/approval state layered on top.
interface RuleCandidateState extends CandidateRule {
  status: "pending" | "approved" | "discarded";
}

// Build consistent tags for a saved pitch from the JD analysis, mirroring the
// lowercase skill tags used in the seed pitches.
function tagsFromAnalysis(result: GenerationResult): string[] {
  const skills = [
    ...result.jdAnalysis.requiredSkills,
    ...result.jdAnalysis.niceToHaveSkills,
  ];
  return Array.from(
    new Set(skills.map((s) => s.trim().toLowerCase()).filter(Boolean))
  );
}

export function Generate() {
  const [jd, setJd] = useState("");
  const [platform, setPlatform] = useState<Platform>("toptal");
  const [directive, setDirective] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Feedback-loop state
  const [validateState, setValidateState] = useState<SaveState>("idle");
  const [editing, setEditing] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [deriving, setDeriving] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [pitchSaved, setPitchSaved] = useState(false);
  const [candidates, setCandidates] = useState<RuleCandidateState[] | null>(
    null
  );

  function resetFeedback() {
    setValidateState("idle");
    setEditing(false);
    setEditedText("");
    setFeedback("");
    setDeriving(false);
    setFeedbackError(null);
    setPitchSaved(false);
    setCandidates(null);
  }

  function toMessage(err: unknown): string {
    if (axios.isAxiosError(err)) {
      return err.response?.data?.message ?? err.message;
    }
    if (err instanceof Error) return err.message;
    return "Something went wrong";
  }

  async function handleGenerate() {
    if (!jd.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    resetFeedback();
    try {
      const r = await apiClient.generate(jd, directive, platform);
      setResult(r);
    } catch (err: unknown) {
      setError(toMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  // "Validate pitch" — save the pitch exactly as generated, skip editing.
  async function handleValidate() {
    if (!result) return;
    setValidateState("saving");
    try {
      await apiClient.addPitch({
        text: result.pitch.text,
        tags: tagsFromAnalysis(result),
        roleType: result.jdAnalysis.roleType,
        platform,
      });
      setValidateState("saved");
    } catch (err: unknown) {
      setValidateState("error");
      setFeedbackError(toMessage(err));
    }
  }

  function startEditing() {
    if (!result) return;
    setEditing(true);
    setEditedText(result.pitch.text);
  }

  // Save the edited pitch, then ask the backend to propose reusable rules.
  async function handleSaveAndDerive() {
    if (!result) return;
    setDeriving(true);
    setFeedbackError(null);
    try {
      await apiClient.addPitch({
        text: editedText,
        tags: tagsFromAnalysis(result),
        roleType: result.jdAnalysis.roleType,
        platform,
      });
      setPitchSaved(true);

      const { rules } = await apiClient.deriveRules({
        jd,
        originalPitch: result.pitch.text,
        editedPitch: editedText,
        feedback,
        platform,
      });
      setCandidates(rules.map((r) => ({ ...r, status: "pending" })));
    } catch (err: unknown) {
      setFeedbackError(toMessage(err));
    } finally {
      setDeriving(false);
    }
  }

  function updateCandidateText(index: number, text: string) {
    setCandidates((prev) =>
      prev
        ? prev.map((c, i) => (i === index ? { ...c, text } : c))
        : prev
    );
  }

  async function approveCandidate(index: number) {
    const candidate = candidates?.[index];
    if (!candidate) return;
    try {
      await apiClient.addRule({ text: candidate.text, platform });
      setCandidates((prev) =>
        prev
          ? prev.map((c, i) =>
              i === index ? { ...c, status: "approved" } : c
            )
          : prev
      );
    } catch (err: unknown) {
      setFeedbackError(toMessage(err));
    }
  }

  function discardCandidate(index: number) {
    setCandidates((prev) =>
      prev
        ? prev.map((c, i) =>
            i === index ? { ...c, status: "discarded" } : c
          )
        : prev
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Generate a pitch</h2>
        <p className="text-sm text-slate-600">
          Paste a job description. PitchForge will retrieve your relevant
          experience and write two pitch variations.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="mb-3">
          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">
            Platform
          </label>
          <div className="flex gap-2">
            {(Object.keys(PLATFORM_LABELS) as Platform[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium border ${
                  platform === p
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
                }`}
              >
                {PLATFORM_LABELS[p]}
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Sets the pitch language &amp; voice, and scopes which past pitches
            and rules are used.
          </p>
        </div>
        <textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste the job description here..."
          className="w-full min-h-[200px] p-3 border border-slate-200 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
        <div className="mt-3">
          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">
            Custom directive <span className="normal-case">(optional)</span>
          </label>
          <input
            type="text"
            value={directive}
            onChange={(e) => setDirective(e.target.value)}
            placeholder="e.g. Mainly use my Acme experience, and keep it under 200 words"
            className="w-full p-3 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          <p className="mt-1 text-xs text-slate-500">
            A one-off instruction for this pitch, applied like a rule.
          </p>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-slate-500">{jd.length} characters</span>
          <button
            onClick={handleGenerate}
            disabled={loading || !jd.trim()}
            className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Generating..." : "Generate pitch"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* JD Analysis */}
          <section className="bg-white border border-slate-200 rounded-lg p-5">
            <h3 className="font-semibold mb-3">JD Analysis</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-slate-500 text-xs uppercase mb-1">
                  Role
                </div>
                <div>{result.jdAnalysis.roleTitle}</div>
              </div>
              <div>
                <div className="text-slate-500 text-xs uppercase mb-1">
                  Tone
                </div>
                <div>{result.jdAnalysis.tone}</div>
              </div>
              <div>
                <div className="text-slate-500 text-xs uppercase mb-1">
                  Required skills
                </div>
                <div className="flex flex-wrap gap-1">
                  {result.jdAnalysis.requiredSkills.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 bg-slate-100 rounded text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-slate-500 text-xs uppercase mb-1">
                  Nice to have
                </div>
                <div className="flex flex-wrap gap-1">
                  {result.jdAnalysis.niceToHaveSkills.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 bg-slate-100 rounded text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              {result.jdAnalysis.redFlags.length > 0 && (
                <div className="col-span-2">
                  <div className="text-slate-500 text-xs uppercase mb-1">
                    Things to address
                  </div>
                  <ul className="list-disc list-inside text-slate-700">
                    {result.jdAnalysis.redFlags.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* Pitch */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Your pitch</h3>
              <span className="text-xs text-slate-500">
                {result.pitch.wordCount} words
              </span>
            </div>
            <p className="whitespace-pre-wrap text-sm text-slate-800 flex-1">
              {result.pitch.text}
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs space-y-2">
              <div>
                <span className="text-slate-500">Based on: </span>
                <span className="text-slate-700">
                  {result.pitch.usedExperiences.join(", ") || "—"}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Mentions: </span>
                <span className="text-slate-700">
                  {result.pitch.usedSkills.join(", ") || "—"}
                </span>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(result.pitch.text)}
              className="mt-3 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-xs font-medium self-start"
            >
              Copy
            </button>
          </div>

          {/* Feedback loop */}
          <section className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
            <div>
              <h3 className="font-semibold">Improve future pitches</h3>
              <p className="text-sm text-slate-600">
                Validate this pitch to save it as a future example, or edit it
                and explain your changes so PitchForge can learn reusable rules.
              </p>
            </div>

            {!editing && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleValidate}
                  disabled={
                    validateState === "saving" || validateState === "saved"
                  }
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {validateState === "saving"
                    ? "Saving..."
                    : validateState === "saved"
                      ? "Saved ✓"
                      : "Validate pitch"}
                </button>
                <button
                  onClick={startEditing}
                  disabled={validateState === "saved"}
                  className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Edit & give feedback
                </button>
                {validateState === "saved" && (
                  <span className="text-xs text-emerald-700">
                    Added to your examples.
                  </span>
                )}
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
                    onChange={(e) => setEditedText(e.target.value)}
                    className="w-full min-h-[200px] p-3 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-1">
                    What did you change, and why?
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="e.g. Removed the 'fast-paced environments' cliché, switched to first person, led with the logistics project..."
                    className="w-full min-h-[100px] p-3 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSaveAndDerive}
                    disabled={deriving || pitchSaved || !editedText.trim()}
                    className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deriving ? "Saving & analyzing..." : "Save & derive rules"}
                  </button>
                  {pitchSaved && (
                    <span className="text-xs text-emerald-700">
                      Edited pitch saved as an example.
                    </span>
                  )}
                </div>
              </div>
            )}

            {feedbackError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
                {feedbackError}
              </div>
            )}

            {/* Candidate rules to approve */}
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
                    No reusable rules found in these edits. Your pitch was still
                    saved as an example.
                  </p>
                )}
                {candidates.map((c, i) => (
                  <div
                    key={i}
                    className="border border-slate-200 rounded-md p-3 space-y-2"
                  >
                    <textarea
                      value={c.text}
                      onChange={(e) => updateCandidateText(i, e.target.value)}
                      disabled={c.status !== "pending"}
                      className="w-full p-2 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:bg-slate-50 disabled:text-slate-500"
                      rows={2}
                    />
                    <p className="text-xs text-slate-500">Why: {c.reason}</p>
                    {c.status === "pending" && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => approveCandidate(i)}
                          className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-medium hover:bg-emerald-700"
                        >
                          Approve & save rule
                        </button>
                        <button
                          onClick={() => discardCandidate(i)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-xs font-medium"
                        >
                          Discard
                        </button>
                      </div>
                    )}
                    {c.status === "approved" && (
                      <span className="text-xs text-emerald-700">
                        Saved to your rules ✓
                      </span>
                    )}
                    {c.status === "discarded" && (
                      <span className="text-xs text-slate-500">Discarded</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Metadata */}
          <details className="bg-white border border-slate-200 rounded-lg p-4 text-sm">
            <summary className="cursor-pointer font-medium text-slate-600">
              Retrieval debug info
            </summary>
            <pre className="mt-3 text-xs overflow-auto bg-slate-50 p-3 rounded">
              {JSON.stringify(result.metadata, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
