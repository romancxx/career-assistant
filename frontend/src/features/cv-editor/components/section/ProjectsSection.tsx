import {useState} from "react";

import type {Cv, Project} from "@/interfaces/cv-pdf";

import {Card} from "@/features/cv-editor/components/card/Card";
import {ProjectCard} from "@/features/cv-editor/components/card/ProjectCard";
import {ProjectForm} from "@/features/cv-editor/components/form/ProjectForm";
import {AddBtn} from "@/features/cv-editor/components/input/AddBtn";

interface Props {
  projects: Cv["projects"];
  update: (fn: (draft: Cv) => void) => void;
}

type FormState =
  | {mode: "closed"}
  | {mode: "adding"}
  | {mode: "editing"; index: number};

const CLOSED: FormState = {mode: "closed"};

export function ProjectsSection({projects = [], update}: Props) {
  const [form, setForm] = useState<FormState>(CLOSED);

  function save(project: Project) {
    update(d => {
      const list = (d.projects ??= []);
      if (form.mode === "editing") list[form.index] = project;
      else list.push(project);
    });
    setForm(CLOSED);
  }

  function remove(index: number) {
    update(d => d.projects?.splice(index, 1));
    setForm(prev =>
      prev.mode === "editing" && prev.index === index ? CLOSED : prev,
    );
  }

  return (
    <Card title="Projects">
      <div className="space-y-4">
        {projects.map((project, i) =>
          form.mode === "editing" && form.index === i ? (
            <ProjectForm
              key={i}
              initial={project}
              onSubmit={save}
              onCancel={() => setForm(CLOSED)}
            />
          ) : (
            <ProjectCard
              key={i}
              project={project}
              onEdit={() => setForm({mode: "editing", index: i})}
              onRemove={() => remove(i)}
            />
          ),
        )}

        {form.mode === "adding" ? (
          <ProjectForm onSubmit={save} onCancel={() => setForm(CLOSED)} />
        ) : (
          <AddBtn
            label="Add project"
            onClick={() => setForm({mode: "adding"})}
          />
        )}
      </div>
    </Card>
  );
}
