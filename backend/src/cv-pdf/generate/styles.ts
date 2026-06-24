import * as fs from "fs";
import * as path from "path";

const FONT_DIR = path.join(__dirname, "..", "fonts");

function fontFace(file: string, weight: number): string {
  const data = fs.readFileSync(path.join(FONT_DIR, file)).toString("base64");
  return `@font-face {
  font-family: 'Carlito';
  font-style: normal;
  font-weight: ${weight};
  src: url(data:font/truetype;charset=utf-8;base64,${data}) format('truetype');
}`;
}

export function renderStyles(): string {
  return `
${fontFace("Carlito-Regular.ttf", 400)}
${fontFace("Carlito-Bold.ttf", 700)}

@page {
  size: A4;
  margin: 16mm 18mm;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

html {
  font-family: 'Carlito', Arial, sans-serif;
  font-size: 10.5pt;
  line-height: 1.42;
  color: #111;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

body { orphans: 3; widows: 3; }

a { color: inherit; text-decoration: none; }

header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

h1 {
  font-size: 25pt;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1.04;
}

.headline {
  font-size: 12pt;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.contact {
  margin-top: 4px;
  font-size: 9pt;
  color: #333;
  line-height: 1.3;
}

.photo {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

section {
  padding-top: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid #aeaeae;
}
section:last-of-type { border-bottom: none; }


h2 {
  font-size: 12.5pt;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 2px;
  break-after: avoid;
}

.separator { border-bottom: 1px solid #e6e6e6; }

p.summary { text-align: justify; padding-top: 10px; padding-bottom: 10px; }

.entry { break-inside: avoid; }
.entry-grouped { break-inside: auto; }
.entry + .entry {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #e6e6e6;
}

.entry-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  break-after: avoid;
}

.entry-title { font-size: 11pt; font-weight: 700; }
.entry-dates { font-size: 10pt; font-weight: 700; white-space: nowrap; }

.tagline {
  font-size: 9pt;
  font-style: italic;
  color: #555;
}

.entry-note {
  font-size: 9.5pt;
  font-style: italic;
  text-decoration: underline;
  color: #333;
  margin-top: 8px;
}

.engagement { break-inside: auto; margin-top: 6px; }
.engagement-title { font-size: 10.5pt; font-weight: 700; }

ul.highlights { list-style: disc; padding-left: 18px; margin-top: 4px; font-size: 10pt; line-height: 1.3; }
ul.highlights li { margin-bottom: 2.5px; break-inside: avoid; }

.skill-group { margin-bottom: 1px; }
.skill-group .label { font-weight: 700; }

.edu-entry { break-inside: avoid; line-height: 1.4; }
.edu-entry + .edu-entry { margin-top: 6px; }
.edu-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 10px;
}
.edu-school { font-weight: 700; font-size: 10pt; }
.edu-program { font-weight: 600; font-size: 9.5pt; }
.edu-notes { font-size: 9pt; color: #444; margin-top: 1px; }
`.trim();
}
