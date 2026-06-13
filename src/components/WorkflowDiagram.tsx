import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Circle, AlertTriangle, Cpu, FileText, Target, Route as RouteIcon } from "lucide-react";
import type { AgentName, AgentStatus } from "@/lib/agents";
import { cn } from "@/lib/utils";

interface Props {
  statuses: Record<AgentName, AgentStatus>;
  coordinatorStatus: AgentStatus;
}

const AGENTS: { id: AgentName; title: string; role: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "resume", title: "Resume Agent", role: "Evaluation Specialist", icon: FileText },
  { id: "ats", title: "ATS Agent", role: "Optimization Specialist", icon: Target },
  { id: "roadmap", title: "Roadmap Agent", role: "Career Development Coach", icon: RouteIcon },
];

function StatusPill({ status }: { status: AgentStatus }) {
  const map = {
    pending: { label: "Pending", cls: "bg-muted text-muted-foreground", Icon: Circle },
    running: { label: "Running", cls: "bg-accent-glow/20 text-accent-glow", Icon: Loader2 },
    completed: { label: "Completed", cls: "bg-success/20 text-success", Icon: CheckCircle2 },
    error: { label: "Error", cls: "bg-danger/20 text-danger", Icon: AlertTriangle },
  } as const;
  const { label, cls, Icon } = map[status];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", cls)}>
      <Icon className={cn("h-3 w-3", status === "running" && "animate-spin")} />
      {label}
    </span>
  );
}

export function WorkflowDiagram({ statuses, coordinatorStatus }: Props) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Multi-Agent Workflow</h3>
        <span className="text-xs text-muted-foreground">Live orchestration</span>
      </div>

      {/* Coordinator */}
      <div className="flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "relative w-full max-w-md rounded-2xl border-2 p-4 text-center",
            coordinatorStatus === "running" ? "border-accent-glow shadow-[0_0_30px_-5px] shadow-accent-glow" : "border-border",
            "bg-gradient-to-br from-brand/15 to-accent-glow/15",
          )}
        >
          <div className="flex items-center justify-center gap-2">
            <Cpu className="h-5 w-5 text-accent-glow" />
            <span className="font-display text-lg font-semibold">Coordinator Agent</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Orchestrates Resume, ATS & Roadmap agents</p>
          <div className="mt-2 flex justify-center">
            <StatusPill status={coordinatorStatus} />
          </div>
        </motion.div>
      </div>

      {/* Connector lines */}
      <div className="relative mx-auto my-2 h-8 max-w-xl">
        <svg viewBox="0 0 600 32" className="h-full w-full" preserveAspectRatio="none">
          <path d="M300 0 V12 H100 V32" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-border" />
          <path d="M300 0 V12 H300 V32" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-border" />
          <path d="M300 0 V12 H500 V32" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-border" />
        </svg>
      </div>

      {/* Three agents */}
      <div className="grid gap-4 sm:grid-cols-3">
        {AGENTS.map(({ id, title, role, icon: Icon }) => {
          const s = statuses[id];
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-xl border p-4 transition-all",
                s === "running" && "border-accent-glow shadow-[0_0_25px_-8px] shadow-accent-glow",
                s === "completed" && "border-success/40",
                s === "error" && "border-danger/40",
                s === "pending" && "border-border opacity-70",
                "bg-card",
              )}
            >
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-foreground/5">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-sm font-semibold">{title}</div>
                  <div className="text-[11px] text-muted-foreground">{role}</div>
                </div>
              </div>
              <div className="mt-3">
                <StatusPill status={s} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
