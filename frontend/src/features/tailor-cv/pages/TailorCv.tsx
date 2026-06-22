import { useState } from "react";

import { JdInputCard } from "@/features/tailor-cv/components/card/JdInputCard";
import { AtsMatchSection } from "@/features/tailor-cv/components/section/AtsMatchSection";
import { EducationSection } from "@/features/tailor-cv/components/section/EducationSection";
import { ExperiencesSection } from "@/features/tailor-cv/components/section/ExperiencesSection";
import { SkillsSection } from "@/features/tailor-cv/components/section/SkillsSection";
import { SummarySection } from "@/features/tailor-cv/components/section/SummarySection";
import { useTailorCvMutation } from "@/features/tailor-cv/data/useTailorCvMutation";
import { downloadJson } from "@/features/tailor-cv/utils/download";

export function TailorCv() {
  const [jd, setJd] = useState("");

  const { mutate: tailor, data: cv, isPending: loading, error } = useTailorCvMutation();

  return (
    <div className="space-y-6">
      <JdInputCard jd={jd} loading={loading} onChange={setJd} onTailor={() => tailor(jd)} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">
          {error?.message}
        </div>
      )}

      {cv && (
        <div className="space-y-5">
          <AtsMatchSection
            keywordsMatched={cv.meta.keywordsMatched}
            keywordsMissed={cv.meta.keywordsMissed}
          />

          <SummarySection summary={cv.summary} />

          <ExperiencesSection experiences={cv.experiences} />

          <SkillsSection skills={cv.skills} />

          <EducationSection education={cv.education} />

          <button
            onClick={() => downloadJson(cv)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-md text-sm font-medium"
          >
            Download JSON
          </button>
        </div>
      )}
    </div>
  );
}
