import axios from "axios";
import type {
  Experience,
  GenerationResult,
  ProfileData,
  Pitch,
  Platform,
  Skill,
  Rule,
  DeriveRulesRequest,
  RuleDerivationResult
} from "../interfaces/pitch-assistant";

const api = axios.create({ baseURL: "http://localhost:3000" });

export const apiClient = {
  // Profile
  getAll: () => api.get<ProfileData>("/ingest/all").then((r) => r.data),

  backup: () =>
    api.post<{
      ok: boolean;
      dir: string;
      written: { file: string; count: number }[];
    }>("/ingest/backup").then((r) => r.data),

  addExperience: (data: Experience) =>
    api.post("/ingest/experience", data).then((r) => r.data),

  addSkill: (data: Skill) =>
    api.post("/ingest/skill", data).then((r) => r.data),

  addPitch: (data: Pitch) =>
    api.post("/ingest/pitch", data).then((r) => r.data),

  addRule: (data: Rule) => api.post("/ingest/rule", data).then((r) => r.data),

  updateExperience: (id: string, data: Experience) =>
    api.put(`/ingest/experience/${id}`, data).then((r) => r.data),

  updateSkill: (id: string, data: Skill) =>
    api.put(`/ingest/skill/${id}`, data).then((r) => r.data),

  updatePitch: (id: string, data: Pitch) =>
    api.put(`/ingest/pitch/${id}`, data).then((r) => r.data),

  updateRule: (id: string, data: Rule) =>
    api.put(`/ingest/rule/${id}`, data).then((r) => r.data),

  deleteExperience: (id: string) =>
    api.delete(`/ingest/experience/${id}`).then((r) => r.data),

  deleteSkill: (id: string) =>
    api.delete(`/ingest/skill/${id}`).then((r) => r.data),

  deletePitch: (id: string) =>
    api.delete(`/ingest/pitch/${id}`).then((r) => r.data),

  deleteRule: (id: string) =>
    api.delete(`/ingest/rule/${id}`).then((r) => r.data),

  // Generation
  generate: (jd: string, directive?: string, platform?: Platform) =>
    api
      .post<GenerationResult>("/generate", { jd, directive, platform })
      .then((r) => r.data),

  deriveRules: (data: DeriveRulesRequest) =>
    api
      .post<RuleDerivationResult>("/generate/derive-rules", data)
      .then((r) => r.data)
};
