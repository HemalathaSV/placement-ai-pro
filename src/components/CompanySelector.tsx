import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { type CompanyName } from "@/lib/company-data";

interface CompanySelectorProps {
  selectedCompany: CompanyName;
  onCompanyChange: (company: CompanyName) => void;
}

const companies: CompanyName[] = [
  "Infosys",
  "TCS",
  "Wipro",
  "Accenture",
  "Cognizant",
  "Google",
  "Microsoft",
];

const companyColors: Record<CompanyName, { bg: string; border: string; text: string }> = {
  "Infosys": { bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-700" },
  "TCS": { bg: "bg-emerald-50", border: "border-emerald-300", text: "text-emerald-700" },
  "Wipro": { bg: "bg-cyan-50", border: "border-cyan-300", text: "text-cyan-700" },
  "Accenture": { bg: "bg-purple-50", border: "border-purple-300", text: "text-purple-700" },
  "Cognizant": { bg: "bg-orange-50", border: "border-orange-300", text: "text-orange-700" },
  "Google": { bg: "bg-red-50", border: "border-red-300", text: "text-red-700" },
  "Microsoft": { bg: "bg-indigo-50", border: "border-indigo-300", text: "text-indigo-700" },
};

export function CompanySelector({ selectedCompany, onCompanyChange }: CompanySelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6 mb-8"
    >
      <div className="flex items-center gap-3 mb-4">
        <Building2 className="h-6 w-6 text-blue-600" />
        <h2 className="text-lg font-semibold">Personalize for Target Company</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Select a company to personalize ATS analysis and career roadmap recommendations based on their hiring preferences.
      </p>

      <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
        {companies.map((company) => {
          const colors = companyColors[company];
          const isSelected = selectedCompany === company;

          return (
            <motion.button
              key={company}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCompanyChange(company)}
              className={`relative px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                isSelected
                  ? `${colors.bg} ${colors.text} border-2 ${colors.border} shadow-md`
                  : `border-2 border-gray-200 hover:border-gray-300 text-gray-700`
              }`}
            >
              {company}
              {isSelected && (
                <motion.div
                  layoutId="activeCompany"
                  className="absolute inset-0 rounded-lg border-2 border-current"
                  initial={false}
                  transition={{ type: "spring", stiffness: 380, damping: 40 }}
                />
              )}
              {isSelected && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-current rounded-full" />
              )}
            </motion.button>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        ✓ Analysis is automatically personalized based on company hiring preferences and technical requirements
      </p>
    </motion.div>
  );
}
