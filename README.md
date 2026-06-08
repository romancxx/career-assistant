# Career Assistant

A RAG-powered pitch generator that writes job application pitches grounded in **your real experience**, in **your voice** — not generic LLM output.

You feed it your past pitches, work experiences, skills, and writing style rules once. Then for every new job description, it retrieves the most relevant context and generates a pitch that actually sounds like you.

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
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  Generation (Claude API)                                    │
│                                                             │
│  System prompt + retrieved context + JD                     │
│  → 2 pitch variations                                     │
└─────────────────────────────────────────────────────────────┘
```

## Tech stack

| Layer      | Tool                                |
| ---------- | ----------------------------------- |
| API        | NestJS + TypeScript                 |
| Vector DB  | Qdrant (local Docker)               |
| Embeddings | Ollama + `nomic-embed-text` (local) |
| LLM        | Claude API                          |

---

## Setup

### 1. Clone & install

```bash
git clone <repo-url> career-assistant
cd career-assistant
cd backend && npm install && cd ..
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

Categories: `tone` | `phrase` | `avoid` | `structure`

### 6. Seed the database

```bash
cd backend
npm run seed -- --reset
```

The `--reset` flag wipes existing collections before seeding — useful when you update your JSON files. Omit it to add to existing data.

### 7. Run the backend

```bash
npm run start:dev
```

Backend runs on `http://localhost:3000`.

---

## Project structure

```
career-assistant/
├── docker-compose.yml           # Qdrant + Ollama containers
├── README.md
└── backend/
    ├── data/
    │   ├── experiences.json
    │   ├── skills.json
    │   ├── pitches.json
    │   └── styles.json
    ├── scripts/
    │   └── seed.ts              # Loads JSON files into Qdrant
    └── src/
        ├── embeddings/          # Ollama client (text → vector)
        ├── qdrant/              # Vector DB client
        ├── ingestion/           # POST endpoints for adding data
        ├── retrieval/           # Search across collections for a given JD
        ├── health/              # Smoke test endpoint
        └── ...
```

---

## API endpoints

### Health check

```
GET /health
```

Verifies Claude, Ollama, and Qdrant are all reachable.

### Ingestion

```
POST /ingest/pitch          # Add a past pitch
POST /ingest/experience     # Add a work experience
POST /ingest/skill          # Add a skill
POST /ingest/style          # Add a style rule
GET  /ingest/all            # List everything in the knowledge base
```

### Retrieval

```
POST /retrieval/preview     # Given a JD, return retrieved context
```

Body: `{ "jd": "Job description text..." }`

Useful for debugging — see what the LLM would receive before it generates.

---

## Development workflow

1. **Update knowledge base** → edit JSON files in `backend/data/`
2. **Reseed** → `npm run seed -- --reset`
3. **Test retrieval** → `POST /retrieval/preview` with a sample JD
4. **Verify quality** → top results should genuinely match the JD's focus

---

## Concepts demonstrated

This project is a hands-on exploration of:

- **RAG (Retrieval-Augmented Generation)** — grounding LLM output in verified data
- **Vector embeddings** — turning text into searchable mathematical representations
- **Vector databases** — efficient similarity search at scale
- **Prompt engineering** — system prompts, structured output, anti-hallucination instructions
- **LLM chaining** — breaking one task into focused sub-prompts
- **Local AI infrastructure** — running models without API dependencies

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

# Inspect Qdrant collections directly
curl http://localhost:6333/collections | jq

# Clear a single Qdrant collection manually
curl -X DELETE http://localhost:6333/collections/<name>
```

---

## License

Personal project — do whatever you want with it.
