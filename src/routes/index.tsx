import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Target, Route as RouteIcon, Cpu, Sparkles, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Place AI — Agentic Placement Prep Assistant" },
      { name: "description", content: "An Agentic AI-powered placement preparation assistant. Resume analysis, ATS scoring, and a 30-day learning roadmap, orchestrated by a multi-agent system." },
      { property: "og:title", content: "Place AI — Agentic Placement Prep Assistant" },
      { property: "og:description", content: "Multi-agent AI for resume analysis, ATS scoring, and a 30-day placement roadmap." },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { icon: FileText, title: "Resume Analysis", desc: "Deep, section-by-section critique with a clear 0–10 score." },
  { icon: Target, title: "ATS Compatibility", desc: "Match your resume to the target role with keyword scoring." },
  { icon: RouteIcon, title: "Career Roadmap", desc: "A 30-day, week-by-week plan tailored to your gaps." },
  { icon: Cpu, title: "Multi-Agent Decisions", desc: "Specialist agents coordinated by an orchestrator agent." },
];

function Landing() {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-accent-glow" />
              Powered by an Agentic AI architecture
            </span>
            <h1 className="mt-6 font-display text-5xl font-bold leading-tight sm:text-6xl">
              <span className="text-gradient">Place AI</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
              An Agentic AI-powered Placement Preparation Assistant
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
              Upload your resume, pick a target role, and watch a Coordinator orchestrate three
              specialist agents to deliver a complete placement readiness report.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand to-accent-glow px-5 py-3 text-sm font-semibold text-brand-foreground shadow-lg transition-transform hover:scale-[1.02]"
              >
                Open Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#architecture"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-5 py-3 text-sm font-semibold backdrop-blur hover:bg-card"
              >
                See the architecture <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Why students choose Place AI</h2>
          <p className="mt-2 text-muted-foreground">Four agents working together — not a single chatbot.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="glass group rounded-2xl p-6 transition-all hover:-translate-y-1"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand/20 to-accent-glow/20 text-accent-glow">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section id="architecture" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">The Agentic Architecture</h2>
          <p className="mt-2 text-muted-foreground">A Coordinator Agent orchestrates three specialists.</p>
        </div>

        <div className="glass mx-auto max-w-4xl rounded-3xl p-8">
          <div className="flex flex-col items-center gap-6">
            <Node title="Coordinator Agent" subtitle="Orchestrator" highlight />
            <div className="h-8 w-px bg-border" />
            <div className="grid w-full gap-4 sm:grid-cols-3">
              <Node title="Resume Agent" subtitle="Evaluation Specialist" icon={FileText} />
              <Node title="ATS Agent" subtitle="Optimization Specialist" icon={Target} />
              <Node title="Roadmap Agent" subtitle="Career Development Coach" icon={RouteIcon} />
            </div>
            <div className="h-8 w-px bg-border" />
            <Node title="Unified Placement Readiness Report" subtitle="Final Output" success />
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand to-accent-glow px-5 py-3 text-sm font-semibold text-brand-foreground shadow-lg hover:scale-[1.02]"
          >
            Try it now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        Place AI · Multi-Agent Placement Preparation Assistant
      </footer>
    </main>
  );
}

function Node({
  title, subtitle, icon: Icon, highlight, success,
}: { title: string; subtitle: string; icon?: React.ComponentType<{ className?: string }>; highlight?: boolean; success?: boolean }) {
  return (
    <div
      className={
        "w-full rounded-2xl border p-4 text-center transition-all " +
        (highlight ? "border-accent-glow/60 bg-gradient-to-br from-brand/20 to-accent-glow/20 shadow-[0_0_40px_-10px] shadow-accent-glow" :
         success ? "border-success/40 bg-success/10" : "border-border bg-card")
      }
    >
      <div className="flex items-center justify-center gap-2">
        {Icon ? <Icon className="h-4 w-4 text-accent-glow" /> : <Cpu className="h-4 w-4 text-accent-glow" />}
        <span className="font-display font-semibold">{title}</span>
      </div>
      <div className="mt-0.5 text-[11px] uppercase tracking-widest text-muted-foreground">{subtitle}</div>
    </div>
  );
}
