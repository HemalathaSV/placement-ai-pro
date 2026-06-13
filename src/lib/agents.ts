// Multi-agent service layer for Place AI.
// All agents use Google Gemini via REST. Key resolution:
//   1) localStorage('place_ai_gemini_key')
//   2) import.meta.env.VITE_GEMINI_API_KEY

export type AgentName = "resume" | "ats" | "roadmap";
export type AgentStatus = "pending" | "running" | "completed" | "error";

export interface ResumeReport {
  score: number;
  strengths: string[];
  weaknesses: string[];
  missingSections: string[];
  skillAnalysis: string;
  projectEvaluation: string;
  improvements: string[];
}

export interface AtsReport {
  atsScore: number;
  keywordMatch: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  skillGaps: string[];
  roleCompatibility: string;
  suggestions: string[];
}

export interface RoadmapWeek {
  week: number;
  focus: string;
  tasks: string[];
  resources: string[];
}

export interface RoadmapReport {
  skillGaps: string[];
  weeks: RoadmapWeek[];
  projects: { title: string; description: string }[];
  interviewPlan: string[];
  placementReadiness: number;
}

export interface FinalReport {
  overallScore: number;
  resumeScore: number;
  atsScore: number;
  placementReadiness: number;
  skillGapSummary: string[];
  nextSteps: string[];
  resume: ResumeReport;
  ats: AtsReport;
  roadmap: RoadmapReport;
  role: string;
}

const KEY_STORAGE = "place_ai_gemini_key";

export function getGeminiKey(): string | null {
  if (typeof window !== "undefined") {
    const ls = window.localStorage.getItem(KEY_STORAGE);
    if (ls) return ls;
  }
  const env = (import.meta.env.VITE_GEMINI_API_KEY as string | undefined) ?? "";
  return env || null;
}

export function setGeminiKey(key: string) {
  if (typeof window === "undefined") return;
  if (key) window.localStorage.setItem(KEY_STORAGE, key);
  else window.localStorage.removeItem(KEY_STORAGE);
}

const MODEL = "gemini-2.0-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

async function callGemini<T>(systemRole: string, userPrompt: string, schemaHint: string): Promise<T> {
  const key = getGeminiKey();
  if (!key) throw new Error("Missing Gemini API key. Add it in Settings.");

  const body = {
    system_instruction: { parts: [{ text: systemRole }] },
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `${userPrompt}\n\nReturn ONLY valid minified JSON matching exactly this TypeScript shape (no markdown, no commentary):\n${schemaHint}`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.4,
      responseMimeType: "application/json",
    },
  };

  const res = await fetch(`${ENDPOINT}?key=${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Gemini ${res.status}: ${txt.slice(0, 300)}`);
  }
  const json = await res.json();
  const text: string = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return extractJson<T>(text);
}

function extractJson<T>(text: string): T {
  const trimmed = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    const first = trimmed.indexOf("{");
    const last = trimmed.lastIndexOf("}");
    if (first >= 0 && last > first) {
      return JSON.parse(trimmed.slice(first, last + 1)) as T;
    }
    throw new Error("Agent returned non-JSON response.");
  }
}

// ---- Individual agents ----

export async function runResumeAgent(resumeText: string): Promise<ResumeReport> {
  return callGemini<ResumeReport>(
    "You are a Resume Evaluation Specialist. Be rigorous, specific, and constructive.",
    `Evaluate the following resume.\n\nRESUME:\n${resumeText}`,
    `{"score":number(0-10),"strengths":string[],"weaknesses":string[],"missingSections":string[],"skillAnalysis":string,"projectEvaluation":string,"improvements":string[]}`,
  );
}

export async function runAtsAgent(resumeText: string, role: string): Promise<AtsReport> {
  return callGemini<AtsReport>(
    "You are an ATS Optimization Specialist. Score the resume against the target role with the rigour of a modern Applicant Tracking System.",
    `Target Role: ${role}\n\nRESUME:\n${resumeText}`,
    `{"atsScore":number(0-100),"keywordMatch":number(0-100),"matchedKeywords":string[],"missingKeywords":string[],"skillGaps":string[],"roleCompatibility":string,"suggestions":string[]}`,
  );
}

export async function runRoadmapAgent(
  resumeText: string,
  role: string,
  resume: ResumeReport,
  ats: AtsReport,
): Promise<RoadmapReport> {
  return callGemini<RoadmapReport>(
    "You are a Career Development Coach building practical, week-by-week plans for engineering students.",
    `Target Role: ${role}\n\nRESUME ANALYSIS: ${JSON.stringify(resume)}\n\nATS ANALYSIS: ${JSON.stringify(ats)}\n\nResume excerpt:\n${resumeText.slice(0, 2000)}`,
    `{"skillGaps":string[],"weeks":[{"week":number,"focus":string,"tasks":string[],"resources":string[]}],"projects":[{"title":string,"description":string}],"interviewPlan":string[],"placementReadiness":number(0-100)}`,
  );
}

// ---- Coordinator ----

export interface CoordinatorEvents {
  onStatus: (agent: AgentName, status: AgentStatus, error?: string) => void;
  onResume?: (r: ResumeReport) => void;
  onAts?: (r: AtsReport) => void;
  onRoadmap?: (r: RoadmapReport) => void;
}

export async function runCoordinator(
  resumeText: string,
  role: string,
  ev: CoordinatorEvents,
): Promise<FinalReport> {
  ev.onStatus("resume", "running");
  let resume: ResumeReport;
  try {
    resume = await runResumeAgent(resumeText);
    ev.onResume?.(resume);
    ev.onStatus("resume", "completed");
  } catch (e: any) {
    ev.onStatus("resume", "error", e?.message);
    throw e;
  }

  ev.onStatus("ats", "running");
  let ats: AtsReport;
  try {
    ats = await runAtsAgent(resumeText, role);
    ev.onAts?.(ats);
    ev.onStatus("ats", "completed");
  } catch (e: any) {
    ev.onStatus("ats", "error", e?.message);
    throw e;
  }

  ev.onStatus("roadmap", "running");
  let roadmap: RoadmapReport;
  try {
    roadmap = await runRoadmapAgent(resumeText, role, resume, ats);
    ev.onRoadmap?.(roadmap);
    ev.onStatus("roadmap", "completed");
  } catch (e: any) {
    ev.onStatus("roadmap", "error", e?.message);
    throw e;
  }

  const overallScore = Math.round(
    (resume.score * 10) * 0.3 + ats.atsScore * 0.35 + roadmap.placementReadiness * 0.35,
  );

  return {
    overallScore,
    resumeScore: resume.score,
    atsScore: ats.atsScore,
    placementReadiness: roadmap.placementReadiness,
    skillGapSummary: Array.from(new Set([...(ats.skillGaps ?? []), ...(roadmap.skillGaps ?? [])])).slice(0, 8),
    nextSteps: [
      ...(resume.improvements ?? []).slice(0, 2),
      ...(ats.suggestions ?? []).slice(0, 2),
      ...(roadmap.interviewPlan ?? []).slice(0, 2),
    ],
    resume,
    ats,
    roadmap,
    role,
  };
}
