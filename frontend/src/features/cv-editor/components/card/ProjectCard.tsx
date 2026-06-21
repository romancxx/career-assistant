import type {Project} from "@/interfaces/cv-pdf";

interface Props {
  project: Project;
  onEdit: () => void;
  onRemove: () => void;
}

export function ProjectCard({project, onEdit, onRemove}: Props) {
  return (
    <div className="border border-slate-200 rounded-md p-4 bg-white">
      <div className="flex items-start justify-between gap-2">
        <div className="font-semibold">{project.name}</div>

        <div className="flex gap-2 ml-2 shrink-0">
          <button
            onClick={onEdit}
            className="text-xs text-slate-400 hover:text-slate-700"
          >
            Edit
          </button>

          <button
            onClick={onRemove}
            className="text-xs text-slate-400 hover:text-red-600"
          >
            Remove
          </button>
        </div>
      </div>

      {project.link && (
        <div className="text-xs text-slate-500 mt-0.5">{project.link}</div>
      )}

      {project.description && (
        <p className="text-sm text-slate-600 mt-1">{project.description}</p>
      )}

      <ul className="list-disc list-inside text-sm text-slate-700 mt-2">
        {project.highlights.map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>
    </div>
  );
}
