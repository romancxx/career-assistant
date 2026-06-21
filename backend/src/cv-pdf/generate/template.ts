import * as fs from "fs";
import * as path from "path";

import {
  Basics,
  Cv,
  Education,
  Engagement,
  ExperienceEntry,
  GroupedExperience,
  Project,
  RoleEntry,
  SkillGroup,
} from "@/cv-pdf/interfaces";

import { DATA_DIR } from "@/cv-pdf/generate/cv-loader";
import { renderStyles } from "@/cv-pdf/generate/styles";

const PHOTO_FILES = ["photo.jpg", "photo.jpeg", "photo.png", "photo.webp"];

function findPhoto(): string | null {
  for (const name of PHOTO_FILES) {
    const file = path.join(DATA_DIR, name);
    if (fs.existsSync(file)) {
      const ext = path.extname(file).slice(1).toLowerCase();
      const mime = ext === "jpg" ? "jpeg" : ext;
      return `data:image/${mime};base64,${fs.readFileSync(file).toString("base64")}`;
    }
  }
  return null;
}

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function highlights(items: string[]): string {
  return `<ul class="highlights">${items
    .map((h) => `<li>${esc(h)}</li>`)
    .join("")}</ul>`;
}

function stripScheme(url: string): string {
  return url.replace(/^https?:\/\//, "");
}

function contact(basics: Basics): string {
  const lines = [basics.email, basics.phone, basics.location]
    .filter((p): p is string => Boolean(p))
    .map((p) => `<div>${esc(p)}</div>`);

  const links = basics.links.map(
    (l) => `<div><a href="${esc(l.url)}">${esc(stripScheme(l.url))}</a></div>`,
  );
  return [...lines, ...links].join("");
}

function engagement(e: Engagement): string {
  return `<div class="engagement">
  <div class="engagement-title">${esc(e.client)} - ${esc(e.role)} (${esc(
    e.duration,
  )})</div>
  ${e.tagline ? `<p class="tagline">${esc(e.tagline)}</p>` : ""}
  ${highlights(e.highlights)}
</div>`;
}

function groupedEntry(entry: GroupedExperience): string {
  return `<div class="entry entry-grouped">
  <div class="entry-head">
    <span class="entry-title">${esc(entry.title)}</span>
    <span class="entry-dates">${esc(entry.start)} - ${esc(entry.end)}</span>
  </div>
  ${entry.engagements.map(engagement).join("\n")}
  ${entry.note ? `<p class="entry-note">${esc(entry.note)}</p>` : ""}
</div>`;
}

function roleEntry(entry: RoleEntry): string {
  const dates = entry.duration
    ? `${entry.start} - ${entry.end} (${entry.duration})`
    : `${entry.start} - ${entry.end}`;
  return `<div class="entry">
  <div class="entry-head">
    <span class="entry-title">${esc(entry.company)} - ${esc(entry.role)}</span>
    <span class="entry-dates">${esc(dates)}</span>
  </div>
  ${entry.tagline ? `<p class="tagline">${esc(entry.tagline)}</p>` : ""}
  ${highlights(entry.highlights)}
</div>`;
}

function experienceEntry(entry: ExperienceEntry): string {
  switch (entry.kind) {
    case "grouped":
      return groupedEntry(entry);
    case "role":
      return roleEntry(entry);
    default: {
      const _exhaustive: never = entry;
      return _exhaustive;
    }
  }
}

function project(p: Project): string {
  return `<div class="entry">
  <div class="entry-head">
    <span class="entry-title">${esc(p.name)}</span>
    ${
      p.link
        ? `<span class="entry-dates"><a href="${esc(p.link)}">${esc(
            stripScheme(p.link),
          )}</a></span>`
        : ""
    }
  </div>
  ${p.description ? `<p class="tagline">${esc(p.description)}</p>` : ""}
  ${highlights(p.highlights)}
</div>`;
}

function skillGroup(g: SkillGroup): string {
  return `<div class="skill-group"><span class="label">${esc(
    g.category,
  )}:</span> ${g.items.map(esc).join(", ")}</div>`;
}

function educationEntry(e: Education): string {
  return `<div class="edu-entry">
  <div class="edu-head">
    <span class="edu-school">${esc(e.institution)}</span>
    <span class="entry-dates">${esc(e.start)} - ${esc(e.end)}</span>
  </div>
  <div class="edu-program">${esc(e.program)}</div>
  ${e.notes ? `<div class="edu-notes">${esc(e.notes)}</div>` : ""}
</div>`;
}

function section(title: string, body: string): string {
  return `<section>
  <h2>${title}</h2>
  ${body}
</section>`;
}

export function renderCvHtml(cv: Cv): string {
  const { basics } = cv;
  const photo = findPhoto();
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${esc(basics.name)} - CV</title>
<style>${renderStyles()}</style>
</head>
<body>
<header>
  <div class="header-text">
    <h1>${esc(basics.name)}</h1>
    <div class="headline">${esc(basics.title)}</div>
    <div class="contact">${contact(basics)}</div>
  </div>
  ${photo ? `<img class="photo" src="${photo}" alt="" />` : ""}
</header>
<p class="summary">${esc(cv.summary)}</p>
<div class="separator"></div>

${section("Work Experience", cv.experience.map(experienceEntry).join("\n"))}
${
  cv.projects?.length
    ? section("Projects", cv.projects.map(project).join("\n"))
    : ""
}
${section("Technical Skills", cv.skills.map(skillGroup).join("\n"))}
${section("Education", cv.education.map(educationEntry).join("\n"))}
</body>
</html>`;
}
