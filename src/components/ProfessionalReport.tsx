import { motion } from "framer-motion";
import { Download, FileText } from "lucide-react";
import { type FinalReport } from "@/lib/agents";

interface ProfessionalReportProps {
  report: FinalReport;
  company: string;
  studentName?: string;
  onDownloadPDF?: () => void;
}

export function ProfessionalReport({
  report,
  company,
  studentName = "Student",
  onDownloadPDF,
}: ProfessionalReportProps) {
  const reportSections = [
    {
      title: "Executive Summary",
      content: `${studentName} is ${report.placementReadiness > 75 ? "well-prepared" : "moderately prepared"} for placement in ${report.role} positions. Overall assessment score: ${report.overallScore}/100. The candidate demonstrates ${report.resumeScore > 7 ? "strong" : "moderate"} resume fundamentals with ${report.atsScore > 75 ? "excellent" : "good"} ATS compatibility.`,
      icon: "📋",
    },
    {
      title: "Resume Evaluation",
      content: `Score: ${report.resume.score}/10. Strengths: ${report.resume.strengths.slice(0, 2).join(", ")}. Key areas for improvement: ${report.resume.weaknesses.slice(0, 2).join(", ")}. Missing sections: ${report.resume.missingSections.slice(0, 2).join(", ")}.`,
      icon: "📄",
    },
    {
      title: "ATS Analysis",
      content: `ATS Score: ${report.ats.atsScore}/100. Keyword Match: ${report.ats.keywordMatch}%. Role Compatibility: ${report.ats.roleCompatibility}. Matched keywords: ${report.ats.matchedKeywords.slice(0, 3).join(", ")}. Key skill gaps: ${report.ats.skillGaps.slice(0, 2).join(", ")}.`,
      icon: "🤖",
    },
    {
      title: "Career Readiness",
      content: `Placement Readiness: ${report.placementReadiness}%. The career roadmap spans 4 weeks with focused skill development and project-based learning. Skill gaps: ${report.roadmap.skillGaps.slice(0, 3).join(", ")}. Recommended projects: ${report.roadmap.projects.map(p => p.title).join(", ")}.`,
      icon: "🚀",
    },
    {
      title: "30-Day Action Plan",
      content: report.roadmap.weeks
        .slice(0, 2)
        .map(w => `Week ${w.week}: ${w.focus}`)
        .join(" → "),
      icon: "📅",
    },
    {
      title: "Interview Preparation",
      content: `Focus areas: ${report.roadmap.interviewPlan.slice(0, 3).join(", ")}. Companies target: ${company}. Recommended preparation time: 4-6 weeks for optimal readiness.`,
      icon: "💼",
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Professional Final Report</h2>
          <p className="mt-1 text-sm text-muted-foreground">Comprehensive placement readiness assessment</p>
        </div>
        {onDownloadPDF && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDownloadPDF}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:shadow-lg transition-shadow"
          >
            <Download className="h-4 w-4" />
            Download Professional Report
          </motion.button>
        )}
      </div>

      <div className="space-y-4">
        {reportSections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass rounded-2xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex gap-4">
              <div className="text-2xl flex-shrink-0">{section.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{section.title}</h3>
                <p className="text-sm text-foreground/80 leading-relaxed">{section.content}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Key Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-6 rounded-2xl border-2 border-green-200 bg-green-50 p-6"
      >
        <h3 className="font-semibold text-lg mb-4 text-green-900">Final Recommendations</h3>
        <ul className="space-y-3">
          {report.nextSteps.map((step, index) => (
            <li key={index} className="flex gap-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <span className="text-sm text-green-900">{step}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Skill Gap Summary */}
      {report.skillGapSummary.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-4 rounded-2xl border-2 border-orange-200 bg-orange-50 p-6"
        >
          <h3 className="font-semibold text-lg mb-4 text-orange-900">Critical Skill Gaps to Address</h3>
          <div className="flex flex-wrap gap-2">
            {report.skillGapSummary.map((gap) => (
              <span
                key={gap}
                className="inline-block px-4 py-2 bg-orange-200 text-orange-900 rounded-full text-sm font-medium"
              >
                {gap}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
