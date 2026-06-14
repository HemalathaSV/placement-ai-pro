import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, Star } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface SkillGapAnalysisProps {
  current: string[];
  missing: string[];
  recommended: string[];
  criticalSkills?: string[];
}

const COLORS = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6", "#06b6d4"];

export function SkillGapAnalysis({ current, missing, recommended, criticalSkills = [] }: SkillGapAnalysisProps) {
  // Prepare chart data
  const skillDistribution = [
    { name: "Current Skills", value: current.length, fill: "#10b981" },
    { name: "Missing Skills", value: missing.length, fill: "#ef4444" },
    { name: "To Learn", value: recommended.length, fill: "#3b82f6" },
  ];

  const skillCountData = [
    { category: "Current", count: current.length },
    { category: "Missing", count: missing.length },
    { category: "Recommended", count: recommended.length },
  ];

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Skill Gap Analysis</h2>
        <p className="mt-1 text-sm text-muted-foreground">Comprehensive skills assessment and recommendations</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Skill Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="font-semibold mb-4">Skills Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={skillDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {skillDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Skill Count Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="font-semibold mb-4">Skills Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillCountData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Detailed Skill Cards */}
      <div className="grid gap-6 mt-6 md:grid-cols-3">
        {/* Current Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass rounded-2xl p-6 border-l-4 border-green-500"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">Current Skills</h3>
              <p className="text-xs text-muted-foreground">{current.length} skills</p>
            </div>
          </div>
          <div className="space-y-2">
            {current.slice(0, 5).map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center gap-2 text-sm"
              >
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-foreground">{skill}</span>
              </motion.div>
            ))}
            {current.length > 5 && (
              <p className="text-xs text-muted-foreground pt-2">+{current.length - 5} more skills</p>
            )}
          </div>
        </motion.div>

        {/* Missing Skills (Critical) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass rounded-2xl p-6 border-l-4 border-red-500"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold">Critical Gaps</h3>
              <p className="text-xs text-muted-foreground">{missing.length} skills needed</p>
            </div>
          </div>
          <div className="space-y-2">
            {missing.slice(0, 5).map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-2 text-sm"
              >
                <span className="text-red-600 font-bold">!</span>
                <span className="text-foreground">{skill}</span>
              </motion.div>
            ))}
            {missing.length > 5 && (
              <p className="text-xs text-muted-foreground pt-2">+{missing.length - 5} more gaps</p>
            )}
          </div>
        </motion.div>

        {/* Recommended Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass rounded-2xl p-6 border-l-4 border-blue-500"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Star className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">Recommended</h3>
              <p className="text-xs text-muted-foreground">{recommended.length} to learn</p>
            </div>
          </div>
          <div className="space-y-2">
            {recommended.slice(0, 5).map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-2 text-sm"
              >
                <span className="text-blue-600 font-bold">→</span>
                <span className="text-foreground">{skill}</span>
              </motion.div>
            ))}
            {recommended.length > 5 && (
              <p className="text-xs text-muted-foreground pt-2">+{recommended.length - 5} more recommendations</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Critical Skills Alert */}
      {criticalSkills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 rounded-2xl border-l-4 border-orange-500 bg-orange-50 p-6"
        >
          <div className="flex gap-4">
            <AlertTriangle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-orange-900">Priority Skills to Acquire</h3>
              <p className="text-sm text-orange-800 mt-2">
                These skills are critical for your target role and companies. Focus on acquiring these within the next 30 days:
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {criticalSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-block px-3 py-1 bg-orange-200 text-orange-900 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
