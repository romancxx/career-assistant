import {EditorHeader} from "@/features/cv-editor/components/header/EditorHeader";
import {BasicsSection} from "@/features/cv-editor/components/section/BasicsSection";
import {EducationSection} from "@/features/cv-editor/components/section/EducationSection";
import {ExperienceSection} from "@/features/cv-editor/components/section/ExperienceSection";
import {SkillsSection} from "@/features/cv-editor/components/section/SkillsSection";
import {SummarySection} from "@/features/cv-editor/components/section/SummarySection";
import {useCvEditor} from "@/features/cv-editor/data/useCvEditor";

export function CvEditor() {
  const {
    cv,
    loading,
    error,
    saving,
    saved,
    downloading,
    update,
    save,
    download,
  } = useCvEditor();

  if (loading) return <p className="text-slate-500">Loading…</p>;

  if (error && !cv) return <p className="text-red-600">{error}</p>;

  if (!cv) return null;

  return (
    <div className="space-y-8">
      <EditorHeader
        saved={saved}
        saving={saving}
        downloading={downloading}
        onSave={save}
        onDownload={download}
      />
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <BasicsSection basics={cv.basics} update={update} />

      <SummarySection summary={cv.summary} update={update} />

      <ExperienceSection experience={cv.experience} update={update} />

      <SkillsSection skills={cv.skills} update={update} />

      <EducationSection education={cv.education} update={update} />
    </div>
  );
}
