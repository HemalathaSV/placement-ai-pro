import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { Upload, Play, FileText, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { extractPdfText } from "@/lib/pdf";
import {
  runCoordinator,
  getGeminiKey,
  type AgentName,
  type AgentStatus,
  type AtsReport,
  type FinalReport,
  type ResumeReport,
  type RoadmapReport,
} from "@/lib/agents";
import { WorkflowDiagram } from "@/components/WorkflowDiagram";
import { AtsResultCard, FinalReportCard, ResumeResultCard, RoadmapResultCard } from "@/components/AgentResults";

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
  const [parsing, setParsing] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    if (!getGeminiKey()) {
      setError("Add your Gemini API key in Settings first.");
      return;
    }
    setError(null);
    setResume(null); setAts(null); setRoadmap(null); setFinal(null);
    setStatuses({ resume: "pending", ats: "pending", roadmap: "pending" });
    setCoordinatorStatus("running");
    setRunning(true);
    try {
      const f = await runCoordinator(resumeText, role, {
        onStatus: (a, s) => setStatuses((prev) => ({ ...prev, [a]: s })),
        onResume: setResume,
        onAts: setAts,
        onRoadmap: setRoadmap,
      });
      setFinal(f);
      setCoordinatorStatus("completed");
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
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Multi-Agent Console</div>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Placement Readiness Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Upload your resume, pick a role, and run a coordinated analysis across three specialist agents.
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

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        {/* INPUTS */}
        <section className="glass rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold">1. Upload & Configure</h2>

          <label className="mt-4 block">
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

          <label className="mt-4 block">
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
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={onAnalyze}
            disabled={!resumeText || running || parsing}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-accent-glow px-5 py-3 text-sm font-semibold text-brand-foreground shadow-lg transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {running ? <><Loader2 className="h-4 w-4 animate-spin" />Running Agents…</> : <><Play className="h-4 w-4" />Run Multi-Agent Analysis</>}
          </button>
        </section>

        {/* WORKFLOW */}
        <WorkflowDiagram statuses={statuses} coordinatorStatus={coordinatorStatus} />
      </div>

      {/* RESULTS */}
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
