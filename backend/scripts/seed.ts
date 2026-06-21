import * as fs from "fs";
import * as path from "path";

import { NestFactory } from "@nestjs/core";

import { AppModule } from "@/app.module";
import { ExperienceDto } from "@/ingestion/dto/experience-dto";
import { PitchDto } from "@/ingestion/dto/pitch-dto";
import { RuleDto } from "@/ingestion/dto/rule-dto";
import { SkillDto } from "@/ingestion/dto/skill-dto";
import { IngestionService } from "@/ingestion/ingestion.service";

function loadJson<T>(filename: string): T[] {
  const filePath = path.join(__dirname, "..", "data", filename);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${filename} not found, skipping`);
    return [];
  }
  const content = fs.readFileSync(filePath, "utf-8");

  return JSON.parse(content) as T[];
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ["error", "warn"],
  });

  const ingestion = app.get(IngestionService);

  const reset = process.argv.includes("--reset");
  if (reset) {
    console.log("🧹 --reset: wiping all collections first...");
    await ingestion.resetAll();
    console.log("   done.\n");
  }

  console.log("🌱 Starting seed...\n");

  // Experiences
  const experiences = loadJson<ExperienceDto>("experiences.json");

  console.log(`📋 Ingesting ${experiences.length} experiences...`);
  for (const exp of experiences) {
    await ingestion.ingestExperience(exp);
    console.log(`  ✅ ${exp.companyName} — ${exp.role}`);
  }

  // Skills
  const skills = loadJson<SkillDto>("skills.json");
  console.log(`\n🛠  Ingesting ${skills.length} skills...`);
  for (const skill of skills) {
    await ingestion.ingestSkill(skill);
    console.log(`  ✅ ${skill.name} (${skill.level})`);
  }

  // Pitches
  const pitches = loadJson<PitchDto>("pitches.json");
  console.log(`\n✉️  Ingesting ${pitches.length} pitches...`);
  for (const pitch of pitches) {
    await ingestion.ingestPitch(pitch);
    console.log(`  ✅ ${pitch.roleType ?? "Untitled"}`);
  }

  // Rules
  const rules = loadJson<RuleDto>("rules.json");
  console.log(`\n🎨 Ingesting ${rules.length} rules...`);
  for (const rule of rules) {
    await ingestion.ingestRule(rule);
    console.log(`  ✅ ${rule.text.slice(0, 50)}...`);
  }

  console.log("\n✨ Seed complete!");
  await app.close();
}

bootstrap().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
