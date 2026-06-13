# Place AI — Multi-Agent Placement Preparation Assistant

A modern, responsive React app (TanStack Start + Tailwind v4 + shadcn) that demonstrates an Agentic AI architecture using Google Gemini. A Coordinator Agent orchestrates three specialist agents (Resume, ATS, Career Roadmap) to produce a unified Placement Readiness Report.

## Pages & Routes

- `/` — Landing page (hero, features, architecture diagram, CTA to dashboard)
- `/dashboard` — Resume upload, role selection, run analysis, live agent workflow, results
- `/settings` — Paste/override Gemini API key (stored in localStorage), theme toggle

Shared layout: top nav with logo "Place AI", links (Home, Dashboard, Settings), dark/light toggle.

## Design System

- Tailwind v4 tokens in `src/styles.css` (oklch). Distinctive palette: deep indigo + electric cyan accent + warm amber for highlights — avoids the generic purple-gradient look.
- Typography: Space Grotesk (display) + Inter (body) loaded via `<link>` in `__root.tsx`.
- Glassmorphism cards (`backdrop-blur` + translucent surfaces), gradient hero, soft shadows.
- Framer Motion for hero, card reveals, and sequential agent status animation.
- Dark/light mode via `class="dark"` on `<html>`, toggle persisted in localStorage.
- Fully responsive (mobile nav drawer, stacked cards on small screens).

## Agent Architecture

```text
              ┌──────────────────────┐
              │  Coordinator Agent   │
              └─────────┬────────────┘
       ┌────────────────┼────────────────┐
       ▼                ▼                ▼
 Resume Agent      ATS Agent     Career Roadmap Agent
       └────────────────┼────────────────┘
                        ▼
            Unified Placement Readiness Report
```

Implemented as a service layer under `src/lib/agents/`:

- `gemini.ts` — thin Gemini REST client (`generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`), reads key from `import.meta.env.VITE_GEMINI_API_KEY` or localStorage fallback. JSON-mode responses parsed with a tolerant extractor.
- `resumeAgent.ts` — Resume Evaluation Specialist. Returns `{ score, strengths[], weaknesses[], missingSections[], skillAnalysis, projectEvaluation, improvements[] }`.
- `atsAgent.ts` — ATS Optimization Specialist. Takes resume + role. Returns `{ atsScore, keywordMatch, missingKeywords[], skillGaps[], roleCompatibility, suggestions[] }`.
- `roadmapAgent.ts` — Career Development Coach. Takes resume + ATS + role. Returns `{ skillGaps[], weeks: [{week, focus, tasks[], resources[]}], projects[], interviewPlan[], placementReadiness }`.
- `coordinator.ts` — Orchestrates sequence, emits per-agent status events (`pending | running | completed | error`) via a callback so the UI can animate progress. Aggregates outputs into a final report `{ overallScore, resumeScore, atsScore, skillGapSummary, roadmap, projects, nextSteps[] }`.

Sequence: Resume → ATS → Roadmap → Aggregate. Each step updates status; on error the agent card shows the error and the report falls back gracefully.

## Dashboard UI

1. **Coordinator card** at the top, badge "Orchestrator", live status.
2. **Inputs panel**:
   - PDF upload (uses `pdfjs-dist` to extract text in-browser; shows filename + page count).
   - Target role dropdown: Data Analyst, Data Scientist, UI/UX Designer, Software Engineer, Business Analyst.
   - "Run Multi-Agent Analysis" button (disabled until resume + role present; checks for API key, prompts to open Settings if missing).
3. **Workflow diagram** (SVG): Coordinator at top, three agent nodes below with animated connecting lines. Each node shows status pill (Pending / Running with spinner / Completed with check / Error). Lines pulse when data flows.
4. **Results sections** (revealed as each agent completes):
   - Resume Agent card: score ring (out of 10), strengths/weaknesses lists, missing sections, improvement bullets.
   - ATS Agent card: ATS gauge (0–100), keyword match progress bar, missing keywords as chips, role compatibility meter.
   - Roadmap Agent card: 4-week vertical timeline, recommended projects grid, interview prep checklist, placement readiness ring.
   - Final **Executive Report** card: overall readiness score, combined metrics, next action steps, print/export button (window.print styled).

## Landing Page

- Hero: "Place AI" + subtitle "An Agentic AI-powered Placement Preparation Assistant" + gradient background + animated agent-network illustration + CTA "Open Dashboard".
- Features grid (4 cards): Resume Analysis, ATS Compatibility, Career Roadmap, Multi-Agent Decision Making.
- How-it-works: animated architecture diagram mirroring the dashboard workflow.
- Footer with project tagline.

## Settings

- Input to paste Gemini API key → stored in `localStorage('place_ai_gemini_key')`.
- Status indicator showing whether env key or user key is active.
- Theme toggle.
- Note: key is stored locally in the browser only.

## Technical Details

- Stack: existing TanStack Start template; routes `src/routes/index.tsx`, `src/routes/dashboard.tsx`, `src/routes/settings.tsx`.
- Each route file sets unique `head()` (title, description, og).
- Gemini calls run client-side directly from the browser using the user-provided key (per project spec — "paste their Gemini API key"). No server function needed; this keeps the demo self-contained.
- PDF parsing: `pdfjs-dist` with worker from CDN.
- State: local React state in dashboard; no global store needed.
- Components: small focused files in `src/components/` (Hero, FeatureCard, WorkflowDiagram, AgentCard, ResumeResult, AtsResult, RoadmapTimeline, FinalReport, Navbar, ThemeToggle, FileDropzone, RoleSelect).
- Animations: framer-motion (already common). Add as dependency.
- shadcn primitives reused: card, button, select, progress, badge, dialog, input, tabs, separator, sonner (toasts for errors).

## Files to Add/Modify

- Modify: `src/styles.css` (new tokens, fonts), `src/routes/__root.tsx` (nav, theme provider, font link), `src/routes/index.tsx` (landing).
- Add routes: `src/routes/dashboard.tsx`, `src/routes/settings.tsx`.
- Add: `src/lib/agents/{gemini,resumeAgent,atsAgent,roadmapAgent,coordinator,types}.ts`.
- Add: `src/lib/pdf.ts` (PDF text extraction).
- Add: `src/components/...` listed above.
- Add: `src/hooks/useTheme.ts`, `src/hooks/useGeminiKey.ts`.
- Deps: `pdfjs-dist`, `framer-motion`.

## Open Questions

1. **Gemini key handling**: spec mentions `GEMINI_API_KEY` env var, but the agents must run from the browser. Acceptable to expose via `VITE_GEMINI_API_KEY` (visible in client bundle) plus a Settings override? Or should I instead proxy Gemini through a TanStack server function so the key stays server-side?
2. **Resume input**: PDF only, or also accept pasted text / DOCX? (Plan currently: PDF + paste-text fallback.)
3. **Model**: default to `gemini-2.0-flash` (fast, cheap). OK, or prefer `gemini-1.5-pro`?

I'll proceed with the choices above unless you say otherwise.
