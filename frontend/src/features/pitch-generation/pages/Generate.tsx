import {PitchResultCard} from "@/features/pitch-generation/components/card/PitchResultCard";
import {RetrievalDebug} from "@/features/pitch-generation/components/card/RetrievalDebug";
import {GenerateForm} from "@/features/pitch-generation/components/form/GenerateForm";
import {ImproveFuturePitchesSection} from "@/features/pitch-generation/components/section/ImproveFuturePitchesSection";
import {JdAnalysisSection} from "@/features/pitch-generation/components/section/JdAnalysisSection";
import {usePitchGenerator} from "@/features/pitch-generation/data/usePitchGenerator";

export function Generate() {
  const generator = usePitchGenerator();
  const {result} = generator;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Generate a pitch</h2>

        <p className="text-sm text-slate-600">
          Paste a job description. PitchForge will retrieve your relevant
          experience and write a pitch.
        </p>
      </div>

      <GenerateForm
        generating={generator.generating}
        onGenerate={generator.handleGenerate}
      />

      {generator.generateError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">
          {generator.generateError}
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <JdAnalysisSection analysis={result.jdAnalysis} />

          <PitchResultCard pitch={result.pitch} />

          <ImproveFuturePitchesSection
            editing={generator.editing}
            validating={generator.validating}
            validated={generator.validated}
            onValidate={generator.handleValidate}
            onStartEditing={generator.startEditing}
            editedText={generator.editedText}
            onEditedTextChange={generator.setEditedText}
            feedback={generator.feedback}
            onFeedbackChange={generator.setFeedback}
            deriving={generator.deriving}
            pitchSaved={generator.pitchSaved}
            onSaveAndDerive={generator.handleSaveAndDerive}
            feedbackError={generator.feedbackError}
            candidates={generator.candidates}
            onApproveCandidate={generator.approveCandidate}
            onDiscardCandidate={generator.discardCandidate}
            onUpdateCandidateText={generator.updateCandidateText}
          />

          <RetrievalDebug metadata={result.metadata} />
        </div>
      )}
    </div>
  );
}
