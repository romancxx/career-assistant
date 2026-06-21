export const ApiRoute = {
  // generation
  Generate: "/generate",
  DeriveRules: "/generate/derive-rules",

  // cv
  CvTailor: "/cv/tailor",
  CvPdfData: "/cv-pdf/data",
  CvPdfRender: "/cv-pdf/render",

  // ingestion
  IngestAll: "/ingest/all",
  IngestBackup: "/ingest/backup",
  IngestRule: "/ingest/rule",
  IngestPitch: "/ingest/pitch",
  IngestSkill: "/ingest/skill",
  IngestExperience: "/ingest/experience",
} as const;

export type ApiRoute = (typeof ApiRoute)[keyof typeof ApiRoute];
