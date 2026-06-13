import { motion } from "framer-motion";
import { CheckCircle2, Target, FileText, Lightbulb, BookOpen, Briefcase, MessagesSquare, Trophy } from "lucide-react";
import type { AtsReport, FinalReport, ResumeReport, RoadmapReport } from "@/lib/agents";

function ScoreRing({ value, max = 100, label, color = "var(--accent-glow)" }: { value: number; max?: number; label: string; color?: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid place-items-center">
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={r} stroke="currentColor" className="text-border" strokeWidth="8" fill="none" />
        <motion.circle
          cx="55" cy="55" r={r} stroke={color} strokeWidth="8" fill="none" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * pct) / 100 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          transform="rotate(-90 55 55)"
        />
      </svg>
      <div className="absolute text-center">
        <div className="font-display text-2xl font-bold">{value}{max === 10 ? "/10" : ""}</div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function List({ items, tone = "default" }: { items: string[]; tone?: "default" | "good" | "bad" }) {
  const dot = tone === "good" ? "bg-success" : tone === "bad" ? "bg-danger" : "bg-accent-glow";
  return (
    <ul className="space-y-1.5 text-sm">
      {items?.map((it, i) => (
        <li key={i} className="flex gap-2">
          <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

export function ResumeResultCard({ r }: { r: ResumeReport }) {
  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/15 text-brand"><FileText className="h-5 w-5" /></span>
          <div>
            <h3 className="font-display text-xl font-semibold">Resume Agent</h3>
            <p className="text-xs text-muted-foreground">Evaluation Specialist</p>
          </div>
        </div>
        <ScoreRing value={r.score} max={10} label="Resume" color="var(--brand)" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h4 className="mb-2 text-sm font-semibold text-success">Strengths</h4>
          <List items={r.strengths ?? []} tone="good" />
        </div>
        <div>
          <h4 className="mb-2 text-sm font-semibold text-danger">Weaknesses</h4>
          <List items={r.weaknesses ?? []} tone="bad" />
        </div>
        <div>
          <h4 className="mb-2 text-sm font-semibold">Missing Sections</h4>
          <List items={r.missingSections ?? []} />
        </div>
        <div>
          <h4 className="mb-2 text-sm font-semibold">Improvements</h4>
          <List items={r.improvements ?? []} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border p-4">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Skill Analysis</div>
          <p className="text-sm">{r.skillAnalysis}</p>
        </div>
        <div className="rounded-xl border border-border p-4">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Project Evaluation</div>
          <p className="text-sm">{r.projectEvaluation}</p>
        </div>
      </div>
    </motion.section>
  );
}

export function AtsResultCard({ r }: { r: AtsReport }) {
  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-glow/15 text-accent-glow"><Target className="h-5 w-5" /></span>
          <div>
            <h3 className="font-display text-xl font-semibold">ATS Agent</h3>
            <p className="text-xs text-muted-foreground">Optimization Specialist</p>
          </div>
        </div>
        <ScoreRing value={r.atsScore} label="ATS" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium">Keyword Match</span>
            <span className="text-muted-foreground">{r.keywordMatch}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
            <motion.div initial={{ width: 0 }} animate={{ width: `${r.keywordMatch}%` }} transition={{ duration: 0.8 }} className="h-full bg-gradient-to-r from-brand to-accent-glow" />
          </div>
          <div className="mt-4">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Role Compatibility</div>
            <p className="text-sm">{r.roleCompatibility}</p>
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold">Matched Keywords</h4>
          <div className="mb-4 flex flex-wrap gap-1.5">
            {(r.matchedKeywords ?? []).map((k, i) => (
              <span key={i} className="rounded-full bg-success/15 px-2.5 py-0.5 text-xs text-success">{k}</span>
            ))}
          </div>
          <h4 className="mb-2 text-sm font-semibold">Missing Keywords</h4>
          <div className="flex flex-wrap gap-1.5">
            {(r.missingKeywords ?? []).map((k, i) => (
              <span key={i} className="rounded-full bg-danger/15 px-2.5 py-0.5 text-xs text-danger">{k}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border p-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Skill Gaps</div>
          <List items={r.skillGaps ?? []} tone="bad" />
        </div>
        <div className="rounded-xl border border-border p-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Suggestions</div>
          <List items={r.suggestions ?? []} />
        </div>
      </div>
    </motion.section>
  );
}

export function RoadmapResultCard({ r }: { r: RoadmapReport }) {
  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-warn/15 text-warn"><Lightbulb className="h-5 w-5" /></span>
          <div>
            <h3 className="font-display text-xl font-semibold">Roadmap Agent</h3>
            <p className="text-xs text-muted-foreground">Career Development Coach</p>
          </div>
        </div>
        <ScoreRing value={r.placementReadiness} label="Readiness" color="var(--warn)" />
      </div>

      <h4 className="mb-3 text-sm font-semibold">30-Day Learning Plan</h4>
      <ol className="relative space-y-4 border-l-2 border-border pl-6">
        {(r.weeks ?? []).map((w) => (
          <li key={w.week} className="relative">
            <span className="absolute -left-[31px] grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-brand to-accent-glow text-[11px] font-bold text-brand-foreground">{w.week}</span>
            <div className="rounded-xl border border-border bg-card/50 p-4">
              <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Week {w.week}</div>
              <div className="font-semibold">{w.focus}</div>
              <div className="mt-2 grid gap-3 md:grid-cols-2">
                <div>
                  <div className="mb-1 text-xs font-semibold text-muted-foreground">Tasks</div>
                  <List items={w.tasks ?? []} />
                </div>
                <div>
                  <div className="mb-1 text-xs font-semibold text-muted-foreground"><BookOpen className="mr-1 inline h-3 w-3" />Resources</div>
                  <List items={w.resources ?? []} />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><Briefcase className="h-4 w-4" />Recommended Projects</div>
          <ul className="space-y-2">
            {(r.projects ?? []).map((p, i) => (
              <li key={i}>
                <div className="text-sm font-medium">{p.title}</div>
                <div className="text-xs text-muted-foreground">{p.description}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-border p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><MessagesSquare className="h-4 w-4" />Interview Plan</div>
          <List items={r.interviewPlan ?? []} />
        </div>
      </div>
    </motion.section>
  );
}

export function FinalReportCard({ f }: { f: FinalReport }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-brand/10 via-card to-accent-glow/10 p-6"
    >
      <div className="absolute inset-0 hero-gradient opacity-30" aria-hidden />
      <div className="relative">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand to-accent-glow text-brand-foreground shadow-lg"><Trophy className="h-6 w-6" /></span>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Coordinator Output</div>
              <h2 className="font-display text-2xl font-bold">Placement Readiness Report</h2>
              <div className="text-sm text-muted-foreground">Target role: <span className="font-medium text-foreground">{f.role}</span></div>
            </div>
          </div>
          <ScoreRing value={f.overallScore} label="Overall" color="var(--accent-glow)" />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Metric label="Resume Score" value={`${f.resumeScore}/10`} pct={(f.resumeScore / 10) * 100} />
          <Metric label="ATS Score" value={`${f.atsScore}/100`} pct={f.atsScore} />
          <Metric label="Placement Readiness" value={`${f.placementReadiness}/100`} pct={f.placementReadiness} />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-background/40 p-4">
            <div className="mb-2 text-sm font-semibold">Skill Gap Summary</div>
            <div className="flex flex-wrap gap-1.5">
              {f.skillGapSummary.map((s, i) => (
                <span key={i} className="rounded-full bg-warn/15 px-2.5 py-0.5 text-xs text-warn">{s}</span>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-background/40 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><CheckCircle2 className="h-4 w-4 text-success" />Next Action Steps</div>
            <List items={f.nextSteps} tone="good" />
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function Metric({ label, value, pct }: { label: string; value: string; pct: number }) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-4">
      <div className="flex items-baseline justify-between">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="font-display text-xl font-bold">{value}</div>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-foreground/10">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} className="h-full bg-gradient-to-r from-brand to-accent-glow" />
      </div>
    </div>
  );
}
