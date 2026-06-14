import { motion } from "framer-motion";
import { CheckCircle2, Clock, AlertCircle, Zap } from "lucide-react";
import { type AgentStatus } from "@/lib/agents";

export interface TimelineEntry {
  agent: string;
  event: string;
  status: AgentStatus;
  timestamp?: Date;
}

interface AgentExecutionTimelineProps {
  entries: TimelineEntry[];
  isPresenting?: boolean;
}

export function AgentExecutionTimeline({ entries, isPresenting = false }: AgentExecutionTimelineProps) {
  const getIcon = (status: AgentStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "running":
        return <Zap className="h-5 w-5 text-orange-500 animate-pulse" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case "completed":
        return "border-green-200 bg-green-50";
      case "error":
        return "border-red-200 bg-red-50";
      case "running":
        return "border-orange-200 bg-orange-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Agent Execution Timeline</h2>
        <p className="mt-1 text-sm text-muted-foreground">Real-time coordinator orchestration</p>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="relative space-y-4">
          {entries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No execution events yet. Run an analysis to see the timeline.</p>
            </div>
          ) : (
            entries.map((entry, index) => (
              <motion.div
                key={`${entry.agent}-${entry.event}-${index}`}
                initial={isPresenting ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: isPresenting ? index * 0.5 : 0 }}
                className={`flex gap-4 p-4 rounded-xl border-2 ${getStatusColor(entry.status)} transition-all`}
              >
                <div className="flex-shrink-0 pt-1">{getIcon(entry.status)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm">{entry.agent}</p>
                      <p className="text-xs text-muted-foreground">{entry.event}</p>
                    </div>
                    {entry.timestamp && (
                      <p className="text-xs text-muted-foreground whitespace-nowrap">
                        {entry.timestamp.toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                  <div className="mt-2">
                    <div className="inline-block px-2 py-1 rounded text-xs font-medium bg-foreground/10">
                      {entry.status === "completed" && "✓ Completed"}
                      {entry.status === "running" && "◆ Running"}
                      {entry.status === "error" && "✕ Error"}
                      {entry.status === "pending" && "○ Pending"}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Execution flow diagram */}
        {entries.length > 0 && (
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Execution Flow</p>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-100 text-blue-700 text-sm font-medium">
                📄 Resume
              </div>
              <div className="text-muted-foreground">→</div>
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-100 text-orange-700 text-sm font-medium">
                🤖 ATS
              </div>
              <div className="text-muted-foreground">→</div>
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-100 text-purple-700 text-sm font-medium">
                🎯 Roadmap
              </div>
              <div className="text-muted-foreground">→</div>
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-100 text-green-700 text-sm font-medium">
                ✨ Report
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
