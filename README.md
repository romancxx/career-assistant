# Career Assistant

A RAG-powered **career assistant** for your job search. It learns from your real experience — past pitches, work history, skills, and writing-style rules — and then helps you across the whole application: it **writes pitches in your voice**, **tailors your CV to a job description**, and **renders an ATS-clean PDF** you can send.

Everything is grounded in **your verified data**. The LLM rephrases, selects, and orders — it never invents companies, roles, dates, or skills.

## Features

| Feature              | What it does                                                                                                         | UI route     |
| -------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------ |
| **Pitch generation** | Retrieves your most relevant experience for a JD and writes a pitch in your voice.                                   | `/`          |
| **CV tailoring**     | Turns a JD into a tailored `CvDocument` — reshaped summary, reranked experiences, grouped skills, ATS keyword match. | `/cv`        |
| **CV → PDF**         | Renders a structured CV to an ATS-parseable PDF (single-column, real text, embedded fonts).                          | `/cv-editor` |
| **Profile / KB**     | Manage your knowledge base (experiences, skills, pitches, style rules) from the browser.                             | `/profile`   |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User knowledge base                  │
│                                                             │
│  experiences   skills   pitches   styles                    │
│       │          │         │         │                      │
│       └──────────┴─────────┴─────────┘                      │
│                       │                                     │
│                       ▼                                     │
│              Qdrant vector DB                               │
└─────────────────────────────────────────────────────────────┘
                        │
                        │ vector search (top-k per collection)
                        ▼
┌─────────────────────────────────────────────────────────────┐
│         Retrieval (given a Job Description)                 │
│                                                             │
│  Top 3 experiences  +  Top 8 skills                         │
│  Top 3 past pitches  +  All style rules                     │
└─────────────────────────────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        ▼                               ▼
┌──────────────────────┐      ┌──────────────────────────┐
│  Pitch generation    │      │  CV tailoring            │
│  (Claude API)        │      │  (Claude API)            │
│                      │      │                          │
│  prompt + context +  │      │  JD analysis → tailored  │
│  JD → 1 pitch.       │      │  CvDocument + ATS match  │
└──────────────────────┘      └──────────────────────────┘
```

## Tech stack

| Layer      | Tool                                          |
| ---------- | --------------------------------------------- |
| Frontend   | React 19 + Vite + Tailwind 4 + React Router 7 |
| Data layer | TanStack Query · forms: react-hook-form + yup |
| API        | NestJS + TypeScript                           |
| Vector DB  | Qdrant (local Docker)                         |
| Embeddings | Ollama + `nomic-embed-text` (local)           |
| LLM        | Claude API                                    |
| PDF        | Puppeteer (headless Chromium)                 |

---

## Setup

### 1. Clone & install

```bash
git clone <repo-url> career-assistant
cd career-assistant
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 2. Start Qdrant + Ollama via Docker

From the project root:

```bash
docker compose up -d
```

This starts:

- **Qdrant** on `http://localhost:6333`
- **Ollama** on `http://localhost:11434`

Verify both are alive:

```bash
curl http://localhost:6333
curl http://localhost:11434
```

### 3. Pull the embedding model into Ollama

One-time download (~270MB):

```bash
docker exec -it career-assistant-ollama ollama pull nomic-embed-text
```

Test it:

```bash
curl http://localhost:11434/api/embeddings -d '{
  "model": "nomic-embed-text",
  "prompt": "hello world"
}'
```

You should get back a long array of numbers.

### 4. Configure environment variables

In `backend/`, create a `.env` file:

```bash
ANTHROPIC_API_KEY=sk-ant-your-key-here
QDRANT_URL=http://localhost:6333
OLLAMA_URL=http://localhost:11434
```

### 5. Populate your knowledge base

The `backend/data/` folder is **gitignored** because it contains personal info. You need to create it locally with your own data.

Create `backend/data/` with these four files:

#### `experiences.json`

```json
[
  {
    "companyName": "Company name",
    "companyDescription": "Company Description",
    "role": "Your role title",
    "startDate": "2023-01",
    "endDate": "2025-06",
    "stack": ["react-native", "typescript", "nestjs"],
    "achievements": ["Specific outcome with metrics", "Another achievement"],
    "context": "Optional: company stage, team size, special context"
  }
]
```

#### `skills.json`

```json
[
  {
    "name": "React Native",
    "level": "expert",
    "yearsOfExperience": 4
  }
]
```

Levels: `expert` | `strong` | `competent`

#### `pitches.json`

```json
[
  {
    "text": "The full pitch text you sent...",
    "tags": ["react-native", "mobile"],
    "roleType": "Senior React Native Engineer"
  }
]
```

#### `styles.json`

```json
[
  {
    "text": "Never use generic intros like 'I am writing to apply'."
  }
]
```

#### `profile.json` & `education.json` (for CV tailoring)

These two files hold static personal data used by the **CV Tailoring** feature. They are **not** embedded or seeded — they're read directly from `backend/data/` at request time.

`profile.json`:

```json
{
  "fullName": "Your Name",
  "title": "Full Stack Mobile Developer",
  "email": "you@example.com",
  "location": "Paris, France",
  "linkedin": "https://www.linkedin.com/in/your-handle"
}
```

`education.json`:

```json
[
  {
    "school": "School name",
    "degree": "Degree",
    "startYear": "2015",
    "endYear": "2020",
    "notes": "Optional: GPA, honors, exchange, etc."
  }
]
```

#### `cv.json` (for CV → PDF)

Holds the structured CV rendered by the **CV → PDF** feature (see [CV → PDF](#cv--pdf-ats-clean-render)). An optional `photo.{jpg,png,webp}` alongside it is embedded as a circular header photo.

### 6. Seed the database

```bash
cd backend
npm run seed -- --reset
```

The `--reset` flag wipes existing collections before seeding — useful when you update your JSON files. Omit it to add to existing data.

### 7. Run it

Backend (from `backend/`):

```bash
npm run start:dev          # http://localhost:3000
```

Frontend (from `frontend/`):

```bash
npm run dev                # http://localhost:5173
```

Open the frontend and you land on the pitch generator; use the nav to reach CV tailoring, the CV editor, and your profile.

---

## Project structure

```
career-assistant/
├── docker-compose.yml           # Qdrant + Ollama containers
├── README.md
├── backend/
│   ├── data/                    # personal data (gitignored)
│   │   ├── experiences.json
│   │   ├── skills.json
│   │   ├── pitches.json
│   │   ├── styles.json
│   │   ├── profile.json         # CV: static personal info (not seeded)
│   │   ├── education.json       # CV: static education (not seeded)
│   │   └── cv.json              # CV → PDF source
│   ├── scripts/
│   │   └── seed.ts              # Loads JSON files into Qdrant
│   └── src/
│       ├── embeddings/          # Ollama client (text → vector)
│       ├── qdrant/              # Vector DB client
│       ├── ingestion/           # POST endpoints for adding data
│       ├── retrieval/           # Search across collections for a given JD
│       ├── generation/          # JD analysis + pitch generation
│       ├── cv/                  # CV tailoring (JD → tailored CvDocument)
│       ├── cv-pdf/              # CV → ATS-clean PDF (Puppeteer)
│       ├── llm/                 # Claude API client
│       ├── health/              # Smoke test endpoint
│       └── ...
└── frontend/
    └── src/
        ├── features/
        │   ├── pitch-generation/   # /        — write pitches
        │   ├── tailor-cv/          # /cv      — tailor a CV to a JD
        │   ├── cv-editor/          # /cv-editor — edit + render PDF
        │   └── profile/            # /profile — manage knowledge base
        ├── components/             # shared inputs + navigation
        ├── lib/                    # query client, etc.
        └── interfaces/             # shared API types
```

---

## API endpoints

### Health check

```
GET /health
```

Verifies Claude, Ollama, and Qdrant are all reachable.

### Ingestion (knowledge base)

```
POST /ingest/pitch          # Add a past pitch
POST /ingest/experience     # Add a work experience
POST /ingest/skill          # Add a skill
POST /ingest/rule           # Add a style rule
GET  /ingest/all            # List everything in the knowledge base
POST /ingest/backup         # Snapshot the knowledge base back to JSON
```

### Retrieval

```
POST /retrieval/preview     # Given a JD, return retrieved context
```

Body: `{ "jd": "Job description text..." }`

Useful for debugging — see what the LLM would receive before it generates.

### Pitch generation

```
POST /generate              # Given a JD, return 2 pitch variations
POST /generate/derive-rules # Infer style rules from your past pitches
```

`POST /generate` body: `{ "jd": "Job description text..." }`

### CV tailoring

```
POST /cv/tailor             # Given a JD, return a tailored CvDocument
GET  /cv/profile            # Return static profile + education
```

`POST /cv/tailor` body: `{ "jd": "Job description text..." }`

Pipeline: analyze the JD → load **all** experiences/skills from Qdrant → an LLM tailors the dynamic sections (grounded only in your real data) → static profile/education are injected in code → ATS keyword match is computed deterministically.

The response is a `CvDocument`:

```ts
{
  profile: { fullName, title, email, location, linkedin };   // static
  summary: string;                                           // 50–90 words, tailored
  experiences: {                                             // 4–5, most relevant first
    companyName, companyDescription?, jobType, role,
    startDate, endDate?, context?,                           // copied verbatim
    achievements: string[];                                  // 3–5 rephrased bullets
  }[];
  skills: { category, skills: string[] }[];                  // grouped: Mobile · Web · Backend · Databases · DevOps
  education: { school, degree, startYear, endYear, notes? }[];// static
  meta: {
    generatedAt, targetJdTitle?, targetCompany?,
    keywordsMatched: string[];                               // JD skills found in the CV
    keywordsMissed: string[];                                // JD skills not in the CV
  };
}
```

The LLM only rephrases bullets, selects/orders experiences, and groups skills — it never alters companies, roles, dates, degrees, or invents experience/skills.

### CV → PDF (ATS-clean render)

A self-contained feature (`backend/src/cv-pdf`, frontend _Edit CV_ page) that renders a CV from structured data to an ATS-parseable PDF via Puppeteer. It is **independent** of the LLM CV tailoring above — it has its own data model and shares no types.

```
GET  /cv-pdf/data           # Return the stored CV (backend/data/cv.json)
POST /cv-pdf/render         # Body { "cv": Cv } → streams an application/pdf
```

**Data files** live in `backend/data/` (gitignored, like the other personal data): `cv.json` and an optional `photo.{jpg,png,webp}` that — if present — is embedded as a circular header photo. The fonts ship in `backend/src/cv-pdf/fonts`.

**Front-end:** the _Edit CV_ page (`/cv-editor`) loads the stored CV, lets you tweak text, bullets, and skills per application, and downloads the rendered PDF. Edits are in-memory (tailor → download); the canonical data lives in `cv.json`.

**Data model** (`backend/src/cv-pdf/interfaces`): a single `Cv` with `basics`, `summary`, `experience`, optional `projects`, `skills`, `education`. Experience entries are a discriminated union on `kind`:

- `"role"` — a single company (`company`, `role`, `start`, `end`, `tagline?`, `highlights`)
- `"grouped"` — one header + date range grouping several `engagements` (e.g. freelance), rendered as nested sub-entries

`projects` is **optional** — omit the key (or leave it empty) and the section is skipped. When present it renders as a separate **Projects** section directly below Work Experience. Each project is `{ name, description?, link?, highlights[] }`.

**Why it's ATS-safe:**

- Strictly single-column; DOM source order equals visual reading order.
- Semantic HTML (`header`, `section`, `h1`/`h2`, `ul`/`li`); real text only — no text in SVG/images, no absolutely-positioned text boxes.
- Dates sit inline with the title (flex), not in a separately positioned box.
- Standard headings: Summary, Work Experience, Projects (optional), Technical Skills, Education.
- **Carlito** font (Calibri-metric, SIL OFL) is base64-embedded via `@font-face`, so there is no server-side font substitution and the text layer copy-pastes cleanly.
- A4 `@page` with controlled margins; `break-inside: avoid` on each entry/engagement, `break-after: avoid` on headings, and `orphans`/`widows` control.

**Renderer:** headless Puppeteer with `emulateMediaType('print')` + `page.pdf({ printBackground: true, preferCSSPageSize: true, tagged: true })`. Tagged PDF (better structure/reading order) requires Chromium's new headless — **Chrome ≥ 126 / Puppeteer ≥ 22**; it's silently ignored on older Chromium.

**Verification:** `backend/src/cv-pdf/verify-pdf.ts` extracts the PDF text layer (`pdf-parse`) and `checkSectionOrder()` asserts the headings appear in the expected sequence — the automated "copy-paste test".

---

## Development workflow

1. **Update knowledge base** → edit JSON files in `backend/data/` (or use the `/profile` page)
2. **Reseed** → `npm run seed -- --reset`
3. **Test retrieval** → `POST /retrieval/preview` with a sample JD
4. **Verify quality** → top results should genuinely match the JD's focus

### Tailor a CV

```bash
curl -X POST http://localhost:3000/cv/tailor \
  -H "Content-Type: application/json" \
  -d '{ "jd": "Senior React Native Engineer... (full JD text)" }'
```

Returns a `CvDocument` (see above). In the UI, the **Tailor CV** page (`/cv`) renders each section with copy-to-clipboard buttons and a JSON export.

---

## Concepts demonstrated

This project is a hands-on exploration of:

- **RAG (Retrieval-Augmented Generation)** — grounding LLM output in verified data
- **Vector embeddings** — turning text into searchable mathematical representations
- **Vector databases** — efficient similarity search at scale
- **Prompt engineering** — system prompts, structured output, anti-hallucination instructions
- **LLM chaining** — breaking one task into focused sub-prompts
- **Local AI infrastructure** — running embeddings without API dependencies
- **Document rendering** — generating ATS-parseable PDFs from structured data

---

## Useful commands

```bash
# Start infrastructure
docker compose up -d

# Stop everything
docker compose down

# Wipe + reseed knowledge base
cd backend && npm run seed -- --reset

# Run backend in dev mode
cd backend && npm run start:dev

# Run frontend in dev mode
cd frontend && npm run dev

# Inspect Qdrant collections directly
curl http://localhost:6333/collections | jq

# Clear a single Qdrant collection manually
curl -X DELETE http://localhost:6333/collections/<name>
```

---

## License

Personal project — do whatever you want with it :)
</content>
</invoke>
