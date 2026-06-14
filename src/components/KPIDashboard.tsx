import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

interface KPICardProps {
  title: string;
  score: number;
  maxScore: number;
  unit?: string;
  color: "blue" | "green" | "orange" | "purple";
  icon: React.ReactNode;
}

export function KPICard({ title, score, maxScore, unit = "%", color, icon }: KPICardProps) {
  const percentage = Math.round((score / maxScore) * 100);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;

  const colorMap = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    orange: "from-orange-500 to-orange-600",
    purple: "from-purple-500 to-purple-600",
  };

  const bgColorMap = {
    blue: "bg-blue-500/10",
    green: "bg-green-500/10",
    orange: "bg-orange-500/10",
    purple: "bg-purple-500/10",
  };

  const textColorMap = {
    blue: "text-blue-600",
    green: "text-green-600",
    orange: "text-orange-600",
    purple: "text-purple-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {score.toFixed(1)}{unit}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${bgColorMap[color]} text-lg`}>{icon}</div>
      </div>

      {/* Circular Progress */}
      <div className="relative w-24 h-24 mx-auto mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-foreground/10"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="4"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className={`text-${color}-400`} />
              <stop offset="100%" className={`text-${color}-600`} />
            </linearGradient>
          </defs>
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className={`text-sm font-bold ${textColorMap[color]}`}>{percentage}%</p>
          </div>
        </div>
      </div>

      {/* Status indicator */}
      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
        <TrendingUp className="h-3 w-3 text-green-500" />
        <span>Score: {score.toFixed(1)} / {maxScore}</span>
      </div>
    </motion.div>
  );
}

export function KPIDashboard({
  overallScore,
  resumeScore,
  atsScore,
  placementReadiness,
}: {
  overallScore: number;
  resumeScore: number;
  atsScore: number;
  placementReadiness: number;
}) {
  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Placement Readiness Dashboard</h2>
        <p className="mt-1 text-sm text-muted-foreground">Multi-dimensional assessment of your job readiness</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Overall Score"
          score={overallScore}
          maxScore={100}
          color="blue"
          icon="📊"
        />
        <KPICard
          title="Resume Score"
          score={resumeScore * 10}
          maxScore={100}
          color="green"
          icon="📄"
        />
        <KPICard
          title="ATS Score"
          score={atsScore}
          maxScore={100}
          color="orange"
          icon="🤖"
        />
        <KPICard
          title="Career Readiness"
          score={placementReadiness}
          maxScore={100}
          color="purple"
          icon="🚀"
        />
      </div>
    </div>
  );
}
