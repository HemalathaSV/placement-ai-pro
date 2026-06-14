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
const DEMO_MODE_STORAGE = "place_ai_demo_mode";

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

export function isDemoMode(): boolean {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem(DEMO_MODE_STORAGE) === "true";
  }
  return false;
}

export function setDemoMode(enabled: boolean) {
  if (typeof window === "undefined") return;
  if (enabled) window.localStorage.setItem(DEMO_MODE_STORAGE, "true");
  else window.localStorage.removeItem(DEMO_MODE_STORAGE);
}

let demoModeActivated = false;

export function getDemoModeActivated(): boolean {
  return demoModeActivated;
}

export function resetDemoModeActivated() {
  demoModeActivated = false;
}

const MODEL = "gemini-2.0-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

// Demo mode generators for realistic fallback responses
function generateDemoResumeReport(resumeText: string): ResumeReport {
  const hasExperience = resumeText.toLowerCase().includes("experience") || resumeText.toLowerCase().includes("project");
  const hasEducation = resumeText.toLowerCase().includes("education") || resumeText.toLowerCase().includes("degree");
  const hasSkills = resumeText.toLowerCase().includes("skill") || resumeText.toLowerCase().includes("technical");

  return {
    score: hasExperience ? 7 : 5,
    strengths: [
      hasExperience ? "Clear project experience demonstrated" : "Shows foundational knowledge",
      "Well-organized document structure",
      "Includes key technical terms",
    ],
    weaknesses: [
      "Lacks specific quantifiable achievements",
      "Limited metrics and impact demonstrations",
      !hasEducation ? "Education section incomplete" : "Could expand technical skills section",
    ],
    missingSections: [
      !hasExperience ? "Work experience or projects" : null,
      !hasSkills ? "Technical skills section" : null,
      "Certifications or courses",
    ].filter(Boolean) as string[],
    skillAnalysis: "Resume demonstrates foundational technical knowledge with room for specialization. Focus on cloud technologies and modern frameworks would strengthen candidacy.",
    projectEvaluation: "Project descriptions are present but lack quantifiable impact metrics. Adding specific technologies used and measurable outcomes would improve ATS scoring.",
    improvements: [
      "Quantify achievements with metrics (e.g., '30% performance improvement')",
      "Add specific tech stacks and tools for each project",
      "Include relevant certifications",
      "Expand education with relevant coursework or honors",
    ],
  };
}

function generateDemoAtsReport(resumeText: string, role: string): AtsReport {
  const keywords = extractKeywordsForRole(role);
  const resumeLower = resumeText.toLowerCase();
  const matchedKeywords = keywords.filter(k => resumeLower.includes(k.toLowerCase())).slice(0, 8);
  const missingKeywords = keywords.filter(k => !resumeLower.includes(k.toLowerCase())).slice(0, 6);

  return {
    atsScore: 65 + Math.random() * 20,
    keywordMatch: Math.round((matchedKeywords.length / keywords.length) * 100),
    matchedKeywords,
    missingKeywords,
    skillGaps: [
      "Advanced system design patterns",
      "Cloud infrastructure (AWS/GCP/Azure)",
      "Containerization (Docker/Kubernetes)",
      "CI/CD pipeline experience",
    ],
    roleCompatibility: `Moderate alignment with ${role}. Resume covers foundational requirements but lacks advanced specialization keywords.`,
    suggestions: [
      "Add specific framework versions and tools used",
      `Emphasize ${role}-specific technologies in your experience section`,
      "Include metrics showing impact of projects",
      "List relevant certifications prominently",
    ],
  };
}

function generateDemoRoadmapReport(resumeText: string, role: string, resume: ResumeReport, ats: AtsReport): RoadmapReport {
  const weeks: RoadmapWeek[] = [
    {
      week: 1,
      focus: "Foundation & Assessment",
      tasks: ["Complete skill gap analysis", "Set up development environment", "Review target role requirements"],
      resources: ["LinkedIn Learning courses", "Official framework documentation"],
    },
    {
      week: 2,
      focus: `Advanced ${role} Techniques`,
      tasks: ["Complete 2 advanced tutorials", "Build a mini project", "Document learnings"],
      resources: ["Udemy courses", "GitHub projects", "Technical blogs"],
    },
    {
      week: 3,
      focus: "Portfolio Enhancement",
      tasks: ["Refactor existing project", "Add new portfolio piece", "Prepare case study"],
      resources: ["GitHub", "Portfolio website template"],
    },
    {
      week: 4,
      focus: "Interview Preparation",
      tasks: ["Practice coding challenges", "Prepare behavioral responses", "Mock interviews"],
      resources: ["LeetCode", "System design primers", "Mock interview platforms"],
    },
  ];

  return {
    skillGaps: ats.skillGaps || [],
    weeks,
    projects: [
      {
        title: "Full Stack Application Project",
        description: "Build a complete application demonstrating ${role} skills with modern tech stack",
      },
      {
        title: "Open Source Contribution",
        description: "Contribute to established open source project relevant to target role",
      },
    ],
    interviewPlan: [
      "System design for ${role} role",
      "Behavioral interview prep: Tell us about a challenging project",
      "Technical deep-dive on one portfolio project",
      "Culture fit and team collaboration discussion",
    ],
    placementReadiness: 72,
  };
}

function extractKeywordsForRole(role: string): string[] {
  const roleKeywords: Record<string, string[]> = {
    "software engineer": ["javascript", "react", "typescript", "nodejs", "git", "rest api", "testing", "agile", "sql", "database"],
    "data scientist": ["python", "pandas", "numpy", "matplotlib", "machine learning", "tensorflow", "jupyter", "sql", "statistics", "scikit-learn"],
    "data analyst": ["sql", "tableau", "power bi", "python", "excel", "data visualization", "analytics", "dashboards", "reporting", "excel vba"],
    "ui/ux designer": ["figma", "prototyping", "user research", "wireframing", "design systems", "adobe xd", "usability testing", "css", "html"],
    "business analyst": ["requirements gathering", "sql", "excel", "documentation", "process improvement", "stakeholder management", "agile", "jira"],
  };

  const normalized = role.toLowerCase();
  for (const [key, keywords] of Object.entries(roleKeywords)) {
    if (normalized.includes(key)) return keywords;
  }
  return ["communication", "teamwork", "problem-solving", "documentation", "version control"];
}

async function callGemini<T>(systemRole: string, userPrompt: string, schemaHint: string): Promise<T> {
  const key = getGeminiKey();
  
  // Check if demo mode is enabled or should be auto-activated
  if (!key || isDemoMode()) {
    // If no key and not explicitly in demo mode, would normally throw
    // But this is handled by the calling agent
    if (isDemoMode()) {
      demoModeActivated = true;
      // Generate appropriate demo response based on schema
      return generateDemoResponse<T>(schemaHint) as T;
    }
    if (!key) throw new Error("Missing Gemini API key. Add it in Settings.");
  }

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

  try {
    const res = await fetch(`${ENDPOINT}?key=${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      const status = res.status;
      
      // Handle quota, permission, and server errors by activating demo mode
      if (status === 429 || status === 403 || status === 500) {
        demoModeActivated = true;
        console.warn(`Gemini API error ${status}. Activating Demo Mode.`);
        return generateDemoResponse<T>(schemaHint) as T;
      }
      
      throw new Error(`Gemini ${status}: ${txt.slice(0, 300)}`);
    }

    const json = await res.json();
    const text: string = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    return extractJson<T>(text);
  } catch (e: any) {
    // Network errors also trigger demo mode
    if (e.message.includes("fetch") || e.message.includes("network") || e.message.includes("timeout")) {
      demoModeActivated = true;
      console.warn("Network error. Activating Demo Mode.");
      return generateDemoResponse<T>(schemaHint) as T;
    }
    throw e;
  }
}

function generateDemoResponse<T>(schemaHint: string): T {
  // Parse schema to determine what type of response to generate
  if (schemaHint.includes("atsScore")) {
    return { atsScore: 72, keywordMatch: 68 } as any;
  }
  if (schemaHint.includes("placementReadiness")) {
    return { placementReadiness: 75, weeks: [] } as any;
  }
  if (schemaHint.includes("score")) {
    return { score: 7 } as any;
  }
  return {} as T;
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
  if (isDemoMode()) {
    return generateDemoResumeReport(resumeText);
  }
  return callGemini<ResumeReport>(
    "You are a Resume Evaluation Specialist. Be rigorous, specific, and constructive.",
    `Evaluate the following resume.\n\nRESUME:\n${resumeText}`,
    `{"score":number(0-10),"strengths":string[],"weaknesses":string[],"missingSections":string[],"skillAnalysis":string,"projectEvaluation":string,"improvements":string[]}`,
  );
}

export async function runAtsAgent(resumeText: string, role: string): Promise<AtsReport> {
  if (isDemoMode()) {
    return generateDemoAtsReport(resumeText, role);
  }
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
  if (isDemoMode()) {
    return generateDemoRoadmapReport(resumeText, role, resume, ats);
  }
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
  onDemoModeActivated?: (message: string) => void;
}

export async function runCoordinator(
  resumeText: string,
  role: string,
  ev: CoordinatorEvents,
): Promise<FinalReport> {
  // Reset demo mode flag at the start of each coordinator run
  resetDemoModeActivated();

  ev.onStatus("resume", "running");
  let resume: ResumeReport;
  try {
    resume = await runResumeAgent(resumeText);
    if (getDemoModeActivated()) {
      ev.onDemoModeActivated?.("Gemini quota exceeded. Demo Mode activated.");
    }
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
