import { useEffect, useMemo } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";

import type { Cv } from "@/interfaces/cv-pdf";

import { BasicsForm } from "@/features/cv-editor/components/form/BasicsForm";
import { EducationForm } from "@/features/cv-editor/components/form/EducationForm";
import { ExperienceForm } from "@/features/cv-editor/components/form/ExperienceForm";
import { ProjectsForm } from "@/features/cv-editor/components/form/ProjectsForm";
import { SkillsForm } from "@/features/cv-editor/components/form/SkillsForm";
import { SummaryForm } from "@/features/cv-editor/components/form/SummaryForm";
import { EditorHeader } from "@/features/cv-editor/components/header/EditorHeader";
import { CvTabs } from "@/features/cv-editor/components/navigation/CvTabs";
import { cvSchema, EMPTY_CV } from "@/features/cv-editor/constants/schema";
import { useCvEditor } from "@/features/cv-editor/data/useCvEditor";
import { useCvWorkspace } from "@/features/cv-editor/data/useCvWorkspace";
import { FieldInput } from "@/components/input/FieldInput";

function withPhotoDefault(cv: Cv): Cv {
  return { ...cv, showPhoto: cv.showPhoto ?? true };
}

export function CvEditor() {
  const {
    cvs,
    activeId,
    loading: listLoading,
    error: wsError,
    creating,
    canDelete,
    select,
    create,
    remove
  } = useCvWorkspace();

  const {
    serverCv,
    loading: cvLoading,
    error: cvError,
    saving,
    saved,
    resetSaved,
    downloading,
    save,
    download
  } = useCvEditor(activeId);

  const values = useMemo(() => (serverCv ? withPhotoDefault(serverCv) : undefined), [serverCv]);

  const form = useForm<Cv>({
    resolver: yupResolver(cvSchema),
    defaultValues: EMPTY_CV,
    values
  });

  // Clear the "Saved" flag when switching CVs.
  useEffect(() => resetSaved(), [activeId, resetSaved]);

  const ready = Boolean(serverCv);
  const error = wsError || cvError;

  const onSave = form.handleSubmit(async (values) => {
    const result = await save(values);
    form.reset(withPhotoDefault(result));
  });

  const onDownload = form.handleSubmit((values) => download(values));

  if (listLoading) return <p className="text-slate-500">Loading…</p>;

  if (error && !ready) return <p className="text-red-600">{error}</p>;

  function handleCreate() {
    if (ready) void create(form.getValues());
  }

  function handleDelete(id: string) {
    const target = cvs.find((c) => c.id === id);
    if (window.confirm(`Delete "${target?.label}"?`)) void remove(id);
  }

  return (
    <div className="space-y-8">
      <CvTabs
        tabs={cvs}
        activeId={activeId}
        canDelete={canDelete}
        creating={creating}
        onSelect={select}
        onCreate={handleCreate}
        onDelete={handleDelete}
      />

      {cvLoading || !ready ? (
        <p className="text-slate-500">Loading…</p>
      ) : (
        <FormProvider {...form}>
          <EditorHeader
            saved={saved && !form.formState.isDirty}
            saving={saving}
            downloading={downloading}
            onSave={onSave}
            onDownload={onDownload}
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}

          <FieldInput label="CV name" {...form.register("label")} />

          <BasicsForm />

          <SummaryForm />

          <ExperienceForm />

          <ProjectsForm />

          <SkillsForm />

          <EducationForm />
        </FormProvider>
      )}
    </div>
  );
}
