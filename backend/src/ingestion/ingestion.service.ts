import * as fs from "fs";
import * as path from "path";

import { Injectable } from "@nestjs/common";

import { CollectionName } from "@/qdrant/interfaces";

import { stripEmpty } from "@/common/utils";
import { normalizeLanguage, normalizePerson } from "@/common/voice";
import { EmbeddingsService } from "@/embeddings/embeddings.service";
import { ExperienceDto } from "@/ingestion/dto/experience-dto";
import { PitchDto } from "@/ingestion/dto/pitch-dto";
import { RuleDto } from "@/ingestion/dto/rule-dto";
import { SkillDto } from "@/ingestion/dto/skill-dto";
import { QdrantService } from "@/qdrant/qdrant.service";

@Injectable()
export class IngestionService {
  constructor(
    private embeddings: EmbeddingsService,
    private qdrant: QdrantService,
  ) {}

  async ingestPitch(input: PitchDto, id?: string) {
    const embedInput = `${input.roleType ?? ""}\n\n${input.text}`;
    const vector = await this.embeddings.embed(embedInput);
    const pointId = await this.qdrant.upsert(
      "pitches",
      vector,
      {
        text: input.text,
        roleType: input.roleType ?? null,
        tags: input.tags ?? [],
        language: normalizeLanguage(input.language),
        person: normalizePerson(input.person),
        createdAt: new Date().toISOString(),
      },
      id,
    );
    return { id: pointId, ...input };
  }

  async ingestExperience(input: ExperienceDto, id?: string) {
    const embedInput = [
      input.role,
      input.stack.join(", "),
      input.achievements.join("\n"),
      input.context ?? "",
    ]
      .filter(Boolean)
      .join("\n\n");

    const vector = await this.embeddings.embed(embedInput);
    const pointId = await this.qdrant.upsert(
      "experiences",
      vector,
      {
        companyName: input.companyName,
        companyDescription: input.companyDescription ?? null,
        role: input.role,
        jobType: input.jobType,
        startDate: input.startDate,
        endDate: input.endDate ?? null,
        stack: input.stack,
        achievements: input.achievements,
        context: input.context ?? null,
        createdAt: new Date().toISOString(),
      },
      id,
    );
    return { id: pointId, ...input };
  }

  async ingestSkill(input: SkillDto, id?: string) {
    const embedInput = [input.name, input.level].filter(Boolean).join(" — ");

    const vector = await this.embeddings.embed(embedInput);
    const pointId = await this.qdrant.upsert(
      "skills",
      vector,
      {
        name: input.name,
        level: input.level,
        yearsOfExperience: input.yearsOfExperience ?? null,
        createdAt: new Date().toISOString(),
      },
      id,
    );
    return { id: pointId, ...input };
  }

  async ingestRule(input: RuleDto, id?: string) {
    const vector = await this.embeddings.embed(input.text);
    const pointId = await this.qdrant.upsert(
      "rules",
      vector,
      {
        text: input.text,
        language: normalizeLanguage(input.language),
        person: normalizePerson(input.person),
        createdAt: new Date().toISOString(),
      },
      id,
    );
    return { id: pointId, ...input };
  }

  async resetAll() {
    const collections: CollectionName[] = [
      "pitches",
      "experiences",
      "skills",
      "rules",
    ];
    for (const c of collections) {
      await this.qdrant.recreateCollection(c);
    }
  }

  async listAll() {
    const [pitches, experiences, skills, rules] = await Promise.all([
      this.qdrant.getAll("pitches"),
      this.qdrant.getAll("experiences"),
      this.qdrant.getAll("skills"),
      this.qdrant.getAll("rules"),
    ]);
    return { pitches, experiences, skills, rules };
  }

  // Drops ids/vectors/createdAt — vectors are re-embedded on re-seed.
  async backupToJson() {
    const data = await this.listAll();
    const dir = path.join(process.cwd(), "data");
    fs.mkdirSync(dir, { recursive: true });

    const files: Record<string, Record<string, any>[]> = {
      "experiences.json": data.experiences.map((p) =>
        stripEmpty({
          companyName: p.payload?.companyName,
          companyDescription: p.payload?.companyDescription,
          jobType: p.payload?.jobType,
          role: p.payload?.role,
          startDate: p.payload?.startDate,
          endDate: p.payload?.endDate,
          stack: p.payload?.stack,
          achievements: p.payload?.achievements,
          context: p.payload?.context,
        }),
      ),
      "skills.json": data.skills.map((p) =>
        stripEmpty({
          name: p.payload?.name,
          level: p.payload?.level,
          yearsOfExperience: p.payload?.yearsOfExperience,
        }),
      ),
      "pitches.json": data.pitches.map((p) =>
        stripEmpty({
          text: p.payload?.text,
          tags: p.payload?.tags,
          roleType: p.payload?.roleType,
          language: p.payload?.language,
          person: p.payload?.person,
        }),
      ),
      "rules.json": data.rules.map((p) =>
        stripEmpty({
          text: p.payload?.text,
          language: p.payload?.language,
          person: p.payload?.person,
        }),
      ),
    };

    const written = Object.entries(files).map(([file, rows]) => {
      fs.writeFileSync(
        path.join(dir, file),
        JSON.stringify(rows, null, 2) + "\n",
        "utf-8",
      );
      return { file, count: rows.length };
    });

    return { ok: true, dir, written };
  }

  async delete(collection: CollectionName, id: string) {
    await this.qdrant.delete(collection, id);
    return { id, deleted: true };
  }
}
