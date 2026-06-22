import { useState } from "react";

import type { CandidateRule } from "@/interfaces/pitch-assistant";

import { useDeriveRulesMutation } from "@/features/pitch-generation/data/api/useDeriveRulesMutation";
import type { GeneratePitchParams } from "@/features/pitch-generation/data/api/useGeneratePitchMutation";
import { useGeneratePitchMutation } from "@/features/pitch-generation/data/api/useGeneratePitchMutation";
import { useSavePitchMutation } from "@/features/pitch-generation/data/api/useSavePitchMutation";
import { useSaveRuleMutation } from "@/features/pitch-generation/data/api/useSaveRuleMutation";
import { tagsFromAnalysis } from "@/features/pitch-generation/utils/analysis";
import { toMessage } from "@/utils/errors";

export interface RuleCandidateState extends CandidateRule {
  status: "pending" | "approved" | "discarded";
}

export function usePitchGenerator() {
  const [context, setContext] = useState<GeneratePitchParams | null>(null);
  const [editing, setEditing] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [candidates, setCandidates] = useState<RuleCandidateState[] | null>(null);

  const {
    data: result = null,
    isPending: generating,
    error: generateRawError,
    mutate: generate
  } = useGeneratePitchMutation();

  const {
    isPending: validating,
    isSuccess: validated,
    mutateAsync: validatePitch,
    reset: resetValidate
  } = useSavePitchMutation();

  const {
    isPending: savingDraft,
    isSuccess: pitchSaved,
    error: saveDraftError,
    mutateAsync: saveDraft,
    reset: resetSaveDraft
  } = useSavePitchMutation();

  const {
    isPending: derivingRules,
    error: deriveRulesError,
    mutateAsync: deriveRules,
    reset: resetDeriveRules
  } = useDeriveRulesMutation();

  const { error: saveRuleError, mutateAsync: saveRule } = useSaveRuleMutation();

  const generateError = generateRawError ? toMessage(generateRawError) : null;
  const deriving = savingDraft || derivingRules;
  const feedbackError =
    (saveDraftError && toMessage(saveDraftError)) ||
    (deriveRulesError && toMessage(deriveRulesError)) ||
    (saveRuleError && toMessage(saveRuleError)) ||
    null;

  function handleGenerate(params: GeneratePitchParams) {
    setEditing(false);
    setEditedText("");
    setFeedback("");
    setCandidates(null);
    resetValidate();
    resetSaveDraft();
    resetDeriveRules();
    setContext(params);
    generate(params);
  }

  function startEditing() {
    if (!result) return;
    setEditing(true);
    setEditedText(result.pitch.text);
  }

  async function handleValidate() {
    if (!result || !context) return;
    await validatePitch({
      text: result.pitch.text,
      tags: tagsFromAnalysis(result),
      roleType: result.jdAnalysis.roleType,
      language: context.language,
      person: context.person
    });
  }

  async function handleSaveAndDerive() {
    if (!result || !context) return;
    await saveDraft({
      text: editedText,
      tags: tagsFromAnalysis(result),
      roleType: result.jdAnalysis.roleType,
      language: context.language,
      person: context.person
    });
    const rules = await deriveRules({
      jd: context.jd,
      originalPitch: result.pitch.text,
      editedPitch: editedText,
      feedback,
      language: context.language,
      person: context.person
    });
    setCandidates(rules.map((r) => ({ ...r, status: "pending" })));
  }

  async function approveCandidate(index: number) {
    const candidate = candidates?.[index];
    if (!candidate || !context) return;
    await saveRule({
      text: candidate.text,
      language: context.language,
      person: context.person
    });
    setCandidates((prev) =>
      prev ? prev.map((c, i) => (i === index ? { ...c, status: "approved" as const } : c)) : prev
    );
  }

  function discardCandidate(index: number) {
    setCandidates((prev) =>
      prev ? prev.map((c, i) => (i === index ? { ...c, status: "discarded" as const } : c)) : prev
    );
  }

  function updateCandidateText(index: number, text: string) {
    setCandidates((prev) => (prev ? prev.map((c, i) => (i === index ? { ...c, text } : c)) : prev));
  }

  return {
    editing,
    editedText,
    feedback,
    candidates,
    result,
    generating,
    validating,
    validated,
    deriving,
    pitchSaved,
    generateError,
    feedbackError,
    setEditedText,
    setFeedback,
    handleGenerate,
    startEditing,
    handleValidate,
    handleSaveAndDerive,
    approveCandidate,
    discardCandidate,
    updateCandidateText
  };
}
