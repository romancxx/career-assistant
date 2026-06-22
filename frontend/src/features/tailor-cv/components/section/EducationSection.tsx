import type { CvEducation } from "@/interfaces/pitch-assistant";

interface Props {
  education: CvEducation[];
}

export function EducationSection({ education }: Props) {
  return (
    <section className="bg-white border border-slate-200 rounded-lg p-5 space-y-2">
      <h2 className="text-sm font-semibold text-slate-700">Education</h2>

      {education.map((ed, i) => (
        <p key={i} className="text-sm text-slate-700">
          <span className="font-medium">{ed.degree}</span>
          {ed.degree && ed.school ? " — " : ""}
          {ed.school}{" "}
          <span className="text-slate-400">
            {ed.startYear}

            {ed.startYear || ed.endYear ? "–" : ""}

            {ed.endYear}
          </span>
        </p>
      ))}
    </section>
  );
}
