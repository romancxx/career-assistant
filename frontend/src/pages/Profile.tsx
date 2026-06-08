import { useEffect, useState } from "react";
import { apiClient } from "../api/client";
import type {
  Experience,
  Pitch,
  Platform,
  ProfileData,
  Rule,
  Skill
} from "../interfaces/pitch-assistant";
import { PLATFORM_LABELS } from "../interfaces/pitch-assistant";

type PlatformFilter = "all" | Platform;

function PlatformBadge({ platform }: { platform?: Platform }) {
  const p: Platform = platform ?? "toptal";
  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-medium ${
        p === "malt"
          ? "bg-indigo-100 text-indigo-700"
          : "bg-amber-100 text-amber-700"
      }`}
    >
      {PLATFORM_LABELS[p]}
    </span>
  );
}
import {
  ExperienceForm,
  PitchForm,
  RuleForm,
  SkillForm
} from "./ProfileForms";

type Tab = "experiences" | "skills" | "pitches" | "rules";

export function Profile() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [tab, setTab] = useState<Tab>("experiences");
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("all");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [backupState, setBackupState] = useState<
    "idle" | "saving" | "done" | "error"
  >("idle");
  const [backupMsg, setBackupMsg] = useState<string | null>(null);

  async function refresh() {
    setData(await apiClient.getAll());
  }

  useEffect(() => {
    refresh();
  }, []);

  function selectTab(next: Tab) {
    setTab(next);
    setAdding(false);
    setEditingId(null);
  }

  function closeForm() {
    setAdding(false);
    setEditingId(null);
  }

  async function afterSave() {
    closeForm();
    await refresh();
  }

  async function handleBackup() {
    setBackupState("saving");
    setBackupMsg(null);
    try {
      const res = await apiClient.backup();
      const total = res.written.reduce((sum, w) => sum + w.count, 0);
      setBackupState("done");
      setBackupMsg(`Saved ${total} items to ${res.dir}`);
    } catch {
      setBackupState("error");
      setBackupMsg("Backup failed — is the backend running?");
    }
  }

  async function handleDelete(type: Tab, id: string) {
    if (!confirm("Delete this item? This can't be undone.")) return;
    if (type === "experiences") await apiClient.deleteExperience(id);
    else if (type === "skills") await apiClient.deleteSkill(id);
    else if (type === "pitches") await apiClient.deletePitch(id);
    else await apiClient.deleteRule(id);
    if (editingId === id) closeForm();
    await refresh();
  }

  const saveExperience = async (d: Experience) => {
    if (editingId) await apiClient.updateExperience(editingId, d);
    else await apiClient.addExperience(d);
    await afterSave();
  };
  const saveSkill = async (d: Skill) => {
    if (editingId) await apiClient.updateSkill(editingId, d);
    else await apiClient.addSkill(d);
    await afterSave();
  };
  const savePitch = async (d: Pitch) => {
    if (editingId) await apiClient.updatePitch(editingId, d);
    else await apiClient.addPitch(d);
    await afterSave();
  };
  const saveRule = async (d: Rule) => {
    if (editingId) await apiClient.updateRule(editingId, d);
    else await apiClient.addRule(d);
    await afterSave();
  };

  if (!data) return <div>Loading...</div>;

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "experiences", label: "Experiences", count: data.experiences.length },
    { key: "skills", label: "Skills", count: data.skills.length },
    { key: "pitches", label: "Pitches", count: data.pitches.length },
    { key: "rules", label: "Rules", count: data.rules.length }
  ];

  const showForm = adding || editingId !== null;

  const matchesPlatform = (p?: Platform) =>
    platformFilter === "all" || (p ?? "toptal") === platformFilter;
  const visiblePitches = data.pitches.filter((p) =>
    matchesPlatform(p.payload.platform)
  );
  const visibleRules = data.rules.filter((r) =>
    matchesPlatform(r.payload.platform)
  );

  function platformFilterBar() {
    const options: { key: PlatformFilter; label: string }[] = [
      { key: "all", label: "All platforms" },
      { key: "toptal", label: PLATFORM_LABELS.toptal },
      { key: "malt", label: PLATFORM_LABELS.malt }
    ];
    return (
      <div className="flex gap-2">
        {options.map((o) => (
          <button
            key={o.key}
            onClick={() => setPlatformFilter(o.key)}
            className={`px-3 py-1 rounded-md text-xs font-medium border ${
              platformFilter === o.key
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    );
  }

  function addButton(label: string) {
    return (
      <button
        onClick={() => {
          setEditingId(null);
          setAdding(true);
        }}
        className="w-full border border-dashed border-slate-300 rounded-lg p-3 text-sm text-slate-500 hover:border-slate-400 hover:text-slate-700"
      >
        + Add {label}
      </button>
    );
  }

  function formCard(children: React.ReactNode) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        {children}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Profile</h2>
          <p className="text-sm text-slate-600">
            The data that grounds your pitches. Add, edit, or delete
            experiences, skills, pitches, and rules directly here — changes
            apply immediately.
          </p>
        </div>
        <div className="shrink-0 text-right">
          <button
            onClick={handleBackup}
            disabled={backupState === "saving"}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50 disabled:opacity-50"
          >
            {backupState === "saving" ? "Saving…" : "Back up to disk"}
          </button>
          {backupMsg && (
            <p
              className={`mt-1 text-xs ${
                backupState === "error" ? "text-red-600" : "text-slate-500"
              }`}
            >
              {backupMsg}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => selectTab(t.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              tab === t.key
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.label}{" "}
            <span className="text-xs text-slate-400 ml-1">({t.count})</span>
          </button>
        ))}
      </div>

      {/* ---- EXPERIENCES ---- */}
      {tab === "experiences" && (
        <div className="space-y-3">
          {showForm
            ? formCard(
                <ExperienceForm
                  initial={
                    data.experiences.find((e) => e.id === editingId)?.payload
                  }
                  onSubmit={saveExperience}
                  onCancel={closeForm}
                />
              )
            : addButton("experience")}

          {data.experiences
            .filter((e) => e.id !== editingId)
            .map((e) => (
              <div
                key={e.id}
                className="bg-white border border-slate-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="font-semibold">
                    {e.payload.role} @ {e.payload.companyName}
                  </div>
                  <div className="flex gap-2 ml-2 shrink-0">
                    <button
                      onClick={() => {
                        setAdding(false);
                        setEditingId(e.id);
                      }}
                      className="text-xs text-slate-400 hover:text-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete("experiences", e.id)}
                      className="text-xs text-slate-400 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="text-xs text-slate-500 mb-2">
                  {e.payload.startDate} → {e.payload.endDate ?? "present"}
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {e.payload.stack?.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 bg-slate-100 rounded text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <ul className="list-disc list-inside text-sm text-slate-700">
                  {e.payload.achievements?.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      )}

      {/* ---- SKILLS ---- */}
      {tab === "skills" && (
        <div className="space-y-3">
          {showForm
            ? formCard(
                <SkillForm
                  initial={data.skills.find((s) => s.id === editingId)?.payload}
                  onSubmit={saveSkill}
                  onCancel={closeForm}
                />
              )
            : addButton("skill")}

          <div className="bg-white border border-slate-200 rounded-lg p-4 grid grid-cols-2 md:grid-cols-3 gap-2">
            {data.skills
              .filter((s) => s.id !== editingId)
              .map((s) => (
                <div
                  key={s.id}
                  className="group flex items-center justify-between text-sm"
                >
                  <span>
                    <span className="font-medium">{s.payload.name}</span>
                    <span className="text-xs text-slate-500 ml-2">
                      {s.payload.level}
                      {s.payload.yearsOfExperience
                        ? `, ${s.payload.yearsOfExperience}y`
                        : ""}
                    </span>
                  </span>
                  <span className="flex gap-2 ml-2 shrink-0 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => {
                        setAdding(false);
                        setEditingId(s.id);
                      }}
                      className="text-xs text-slate-400 hover:text-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete("skills", s.id)}
                      className="text-xs text-slate-400 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ---- PITCHES ---- */}
      {tab === "pitches" && (
        <div className="space-y-3">
          {platformFilterBar()}
          {showForm
            ? formCard(
                <PitchForm
                  initial={data.pitches.find((p) => p.id === editingId)?.payload}
                  onSubmit={savePitch}
                  onCancel={closeForm}
                />
              )
            : addButton("pitch")}

          {visiblePitches
            .filter((p) => p.id !== editingId)
            .map((p) => (
              <div
                key={p.id}
                className="bg-white border border-slate-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="text-xs text-slate-500 mb-2 flex items-center gap-2">
                    <PlatformBadge platform={p.payload.platform} />
                    <span>
                      {p.payload.roleType ?? "No role type"} ·{" "}
                      {p.payload.tags?.join(", ")}
                    </span>
                  </div>
                  <div className="flex gap-2 ml-2 shrink-0">
                    <button
                      onClick={() => {
                        setAdding(false);
                        setEditingId(p.id);
                      }}
                      className="text-xs text-slate-400 hover:text-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete("pitches", p.id)}
                      className="text-xs text-slate-400 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-sm whitespace-pre-wrap">{p.payload.text}</p>
              </div>
            ))}
        </div>
      )}

      {/* ---- RULES ---- */}
      {tab === "rules" && (
        <div className="space-y-3">
          {platformFilterBar()}
          {showForm
            ? formCard(
                <RuleForm
                  initial={data.rules.find((r) => r.id === editingId)?.payload}
                  onSubmit={saveRule}
                  onCancel={closeForm}
                />
              )
            : addButton("rule")}

          {visibleRules
            .filter((r) => r.id !== editingId)
            .map((r) => (
              <div
                key={r.id}
                className="bg-white border border-slate-200 rounded-lg p-3 text-sm flex items-start justify-between gap-2"
              >
                <div className="flex items-start gap-2">
                  <PlatformBadge platform={r.payload.platform} />
                  <span>{r.payload.text}</span>
                </div>
                <div className="flex gap-2 ml-2 shrink-0">
                  <button
                    onClick={() => {
                      setAdding(false);
                      setEditingId(r.id);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete("rules", r.id)}
                    className="text-xs text-slate-400 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
