import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { Upload, Play, FileText, AlertCircle, Loader2, Zap, Settings2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { extractPdfText } from "@/lib/pdf";
import { generatePlacementReportPDF } from "@/lib/pdf-export";
import {
  runCoordinator,
  getGeminiKey,
  isDemoMode,
  type AgentName,
  type AgentStatus,
  type AtsReport,
  type FinalReport,
  type ResumeReport,
  type RoadmapReport,
} from "@/lib/agents";
import { type CompanyName } from "@/lib/company-data";
import { WorkflowDiagram } from "@/components/WorkflowDiagram";
import { AtsResultCard, FinalReportCard, ResumeResultCard, RoadmapResultCard } from "@/components/AgentResults";
import { KPIDashboard } from "@/components/KPIDashboard";
import { AgentExecutionTimeline, type TimelineEntry } from "@/components/AgentExecutionTimeline";
import { SkillGapAnalysis } from "@/components/SkillGapAnalysis";
import { ProfessionalReport } from "@/components/ProfessionalReport";
import { CompanySelector } from "@/components/CompanySelector";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard · Place AI" },
      { name: "description", content: "Upload your resume, choose a target role, and run the multi-agent placement readiness analysis." },
      { property: "og:title", content: "Place AI Dashboard" },
      { property: "og:description", content: "Run the multi-agent placement readiness analysis on your resume." },
    ],
  }),
  component: Dashboard,
});

const ROLES = ["Data Analyst", "Data Scientist", "UI/UX Designer", "Software Engineer", "Business Analyst"] as const;

function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [pages, setPages] = useState(0);
  const [role, setRole] = useState<string>(ROLES[3]);
  const [selectedCompany, setSelectedCompany] = useState<CompanyName>("Infosys");
  const [parsing, setParsing] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoNotification, setDemoNotification] = useState<string | null>(null);
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([]);

  const [statuses, setStatuses] = useState<Record<AgentName, AgentStatus>>({
    resume: "pending",
    ats: "pending",
    roadmap: "pending",
  });
  const [coordinatorStatus, setCoordinatorStatus] = useState<AgentStatus>("pending");

  const [resume, setResume] = useState<ResumeReport | null>(null);
  const [ats, setAts] = useState<AtsReport | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapReport | null>(null);
  const [final, setFinal] = useState<FinalReport | null>(null);

  const hasKey = useMemo(() => !!getGeminiKey(), [running, final]);
  const inDemoMode = useMemo(() => isDemoMode(), [running, final]);

  const handleFile = useCallback(async (f: File | null) => {
    setError(null);
    setFile(f);
    setResumeText("");
    setPages(0);
    if (!f) return;
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a PDF resume.");
      return;
    }
    setParsing(true);
    try {
      const { text, pages } = await extractPdfText(f);
      setResumeText(text);
      setPages(pages);
      if (!text || text.length < 80) {
        setError("Couldn't extract enough text from this PDF. Try another file.");
      }
    } catch (e: any) {
      setError(e?.message ?? "Failed to read PDF.");
    } finally {
      setParsing(false);
    }
  }, []);

  const onAnalyze = useCallback(async () => {
    if (!resumeText || !role) return;
    if (!getGeminiKey() && !isDemoMode()) {
      setError("Add your Gemini API key in Settings first.");
      return;
    }
    setError(null);
    setDemoNotification(null);
    setTimelineEntries([]);
    setResume(null); setAts(null); setRoadmap(null); setFinal(null);
    setStatuses({ resume: "pending", ats: "pending", roadmap: "pending" });
    setCoordinatorStatus("running");
    setRunning(true);

    try {
      const entries: TimelineEntry[] = [];

      // Track Resume Agent
      entries.push({ agent: "Resume Agent", event: "Started", status: "running", timestamp: new Date() });
      setTimelineEntries([...entries]);

      const f = await runCoordinator(resumeText, role, selectedCompany, {
        onStatus: (a, s) => {
          setStatuses((prev) => ({ ...prev, [a]: s }));
          entries.push({ agent: `${a} Agent`, event: s === "completed" ? "Completed" : "Error", status: s, timestamp: new Date() });
          setTimelineEntries([...entries]);
        },
        onResume: (r) => {
          setResume(r);
          entries[entries.length - 1] = { ...entries[entries.length - 1], status: "completed" };
          setTimelineEntries([...entries]);
        },
        onAts: (r) => {
          setAts(r);
          const idx = entries.findIndex(e => e.agent === "ats Agent");
          if (idx >= 0) entries[idx] = { ...entries[idx], status: "completed" };
          setTimelineEntries([...entries]);
        },
        onRoadmap: (r) => {
          setRoadmap(r);
          const idx = entries.findIndex(e => e.agent === "roadmap Agent");
          if (idx >= 0) entries[idx] = { ...entries[idx], status: "completed" };
          setTimelineEntries([...entries]);
        },
        onDemoModeActivated: (msg) => setDemoNotification(msg),
      });
      setFinal(f);
      setCoordinatorStatus("completed");
      entries.push({ agent: "Coordinator", event: "Report Generated", status: "completed", timestamp: new Date() });
      setTimelineEntries([...entries]);
    } catch (e: any) {
      setCoordinatorStatus("error");
      setError(e?.message ?? "Analysis failed.");
    } finally {
      setRunning(false);
    }
  }, [resumeText, role]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="mb-8 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Multi-Agent Console</div>
          {(inDemoMode || demoNotification) && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-0.5 text-xs font-semibold text-yellow-600">
              <Zap className="h-3 w-3" />
              Demo Mode - AI Simulation
            </span>
          )}
        </div>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Placement Readiness Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Final-year engineering project level assessment with multi-agent AI orchestration
        </p>
      </header>

      {!hasKey && !final && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-warn/40 bg-warn/10 p-4 text-sm">
          <AlertCircle className="mt-0.5 h-4 w-4 text-warn" />
          <div>
            No Gemini API key detected.{" "}
            <Link to="/settings" className="font-semibold text-warn underline">Add one in Settings</Link> to run live analyses.
          </div>
        </div>
      )}

      {inDemoMode && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-yellow-500/40 bg-yellow-500/10 p-4 text-sm">
          <Zap className="mt-0.5 h-4 w-4 text-yellow-600" />
          <div>
            <span className="font-semibold">Demo Mode Enabled.</span> Generating realistic demo responses for presentations and testing.
            <Link to="/settings" className="ml-1 font-semibold text-yellow-600 underline">Disable in Settings</Link>
          </div>
        </div>
      )}

      {demoNotification && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-6 flex items-start gap-3 rounded-xl border border-yellow-500/60 bg-yellow-500/15 p-4 text-sm"
        >
          <Zap className="mt-0.5 h-4 w-4 text-yellow-600" />
          <div className="font-medium text-yellow-700">{demoNotification}</div>
        </motion.div>
      )}

      {/* Input Section */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] mb-8">
        {/* INPUTS */}
        <section className="glass rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold mb-6">1. Upload & Configure</h2>

          <label className="block mb-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Resume PDF</div>
            <div className="relative grid place-items-center rounded-xl border-2 border-dashed border-border bg-background/30 p-6 transition-colors hover:border-accent-glow/60">
              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
              <div className="text-center">
                {parsing ? (
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-accent-glow" />
                ) : file ? (
                  <FileText className="mx-auto h-6 w-6 text-accent-glow" />
                ) : (
                  <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                )}
                <div className="mt-2 text-sm">
                  {file ? <span className="font-medium">{file.name}</span> : <span>Drop or click to upload PDF</span>}
                </div>
                {pages > 0 && (
                  <div className="mt-1 text-xs text-muted-foreground">{pages} page{pages > 1 ? "s" : ""} · {resumeText.length.toLocaleString()} chars extracted</div>
                )}
              </div>
            </div>
          </label>

          <label className="block mb-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Target Role</div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent-glow"
            >
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </label>

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={onAnalyze}
            disabled={!resumeText || running || parsing}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-accent-glow px-5 py-3 text-sm font-semibold text-brand-foreground shadow-lg transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {running ? <><Loader2 className="h-4 w-4 animate-spin" />Running Agents…</> : <><Play className="h-4 w-4" />Run Multi-Agent Analysis</>}
          </button>
        </section>

        {/* WORKFLOW */}
        <WorkflowDiagram statuses={statuses} coordinatorStatus={coordinatorStatus} />
      </div>

      {/* Company Selector */}
      <CompanySelector selectedCompany={selectedCompany} onCompanyChange={setSelectedCompany} />

      {/* KPI Dashboard */}
      {final && <KPIDashboard overallScore={final.overallScore} resumeScore={final.resumeScore} atsScore={final.atsScore} placementReadiness={final.placementReadiness} />}

      {/* Agent Execution Timeline */}
      {timelineEntries.length > 0 && <AgentExecutionTimeline entries={timelineEntries} isPresenting={running} />}

      {/* Skill Gap Analysis */}
      {final && (
        <SkillGapAnalysis
          current={final.ats.matchedKeywords}
          missing={final.ats.missingKeywords}
          recommended={final.roadmap.skillGaps}
          criticalSkills={final.ats.skillGaps.slice(0, 3)}
        />
      )}

      {/* Professional Report */}
      {final && (
        <ProfessionalReport
          report={final}
          company={selectedCompany}
          studentName="Engineering Student"
          onDownloadPDF={() => {
            generatePlacementReportPDF(final, selectedCompany, "Engineering Student").catch(e => {
              console.error(e);
              alert("Unable to generate PDF report. Check console for details.");
            });
          }}
        />
      )}

      {/* Legacy Results Cards */}
      <div className="mt-8 space-y-6">
        <AnimatePresence mode="popLayout">
          {resume && <ResumeResultCard key="resume" r={resume} />}
          {ats && <AtsResultCard key="ats" r={ats} />}
          {roadmap && <RoadmapResultCard key="roadmap" r={roadmap} />}
          {final && <FinalReportCard key="final" f={final} />}
        </AnimatePresence>
      </div>
    </main>
  );
}
