// Company-specific preparation data
export type CompanyName = "Infosys" | "TCS" | "Wipro" | "Accenture" | "Cognizant" | "Google" | "Microsoft";

export interface CompanyProfile {
  name: CompanyName;
  keywords: string[];
  skillPriorities: string[];
  interviewFocus: string[];
  culturalFit: string[];
  topicsFocus: string[];
}

export const companyProfiles: Record<CompanyName, CompanyProfile> = {
  "Infosys": {
    name: "Infosys",
    keywords: ["Java", "Spring", "Microservices", "Cloud AWS", "DevOps", "Agile", "Oracle", "Angular"],
    skillPriorities: ["Full-stack development", "Cloud AWS", "Microservices architecture", "DevOps CI/CD"],
    interviewFocus: ["Problem-solving", "Technical depth", "Client communication", "Project delivery"],
    culturalFit: ["Adaptability", "Continuous learning", "Team collaboration", "Global mindset"],
    topicsFocus: ["OOP Concepts", "Design patterns", "API design", "Database optimization"],
  },
  "TCS": {
    name: "TCS",
    keywords: ["C++", "Python", "Java", "Cloud", "BigData", "ML/AI", "Angular", "DevOps"],
    skillPriorities: ["Multi-language proficiency", "Big Data analytics", "Machine Learning", "Enterprise applications"],
    interviewFocus: ["Logical thinking", "Aptitude", "Technical fundamentals", "Practical problem-solving"],
    culturalFit: ["Discipline", "Innovation", "Quality focus", "Customer-centric approach"],
    topicsFocus: ["Data structures", "Algorithm optimization", "System design", "Enterprise patterns"],
  },
  "Wipro": {
    name: "Wipro",
    keywords: ["Java", "Python", "React", "Cloud Azure", "Automation", "Kubernetes", "SQL", "NoSQL"],
    skillPriorities: ["Full-stack development", "Cloud Azure", "Test automation", "Containerization"],
    interviewFocus: ["Technical knowledge", "Problem decomposition", "Communication", "Code quality"],
    culturalFit: ["Innovation", "Excellence", "Stewardship", "Integrity"],
    topicsFocus: ["Web development", "Microservices", "Testing strategies", "Cloud platforms"],
  },
  "Accenture": {
    name: "Accenture",
    keywords: ["Java", "JavaScript", "Cloud", "Salesforce", "SAP", "Business analysis", "Agile"],
    skillPriorities: ["Business understanding", "Solution architecture", "Cloud platform expertise", "Consulting skills"],
    interviewFocus: ["Client skills", "Business acumen", "Technical depth", "Leadership potential"],
    culturalFit: ["Collaborative", "Client-focused", "Growth mindset", "Accountability"],
    topicsFocus: ["Enterprise systems", "Business process", "Architecture patterns", "Client communication"],
  },
  "Cognizant": {
    name: "Cognizant",
    keywords: ["C#", ".NET", "Java", "React", "Cloud GCP", "AI/ML", "Automation", "Data science"],
    skillPriorities: ["Diverse tech stack", "AI/ML capabilities", "Modern development", "Cloud GCP"],
    interviewFocus: ["Technical versatility", "Problem-solving", "Analytical thinking", "Innovation"],
    culturalFit: ["Agile mindset", "Continuous innovation", "Customer focus", "Diversity"],
    topicsFocus: ["Multiple languages", "AI/ML basics", "Modern frameworks", "Data engineering"],
  },
  "Google": {
    name: "Google",
    keywords: ["Python", "C++", "Go", "JavaScript", "System design", "Algorithms", "Distributed systems"],
    skillPriorities: ["Algorithm expertise", "System design mastery", "Code quality", "Scalable architecture"],
    interviewFocus: ["Coding excellence", "Technical depth", "System thinking", "Communication clarity"],
    cultureFit: ["Innovation", "Excellence", "Collaboration", "Intellectual curiosity"],
    topicsFocus: ["Advanced algorithms", "System design", "Distributed computing", "Infrastructure"],
  },
  "Microsoft": {
    name: "Microsoft",
    keywords: ["C#", ".NET", "Azure", "PowerShell", "TypeScript", "System design", "Cloud native"],
    skillPriorities: ["Cloud Azure mastery", ".NET ecosystem", "Enterprise patterns", "Scalable design"],
    interviewFocus: ["Technical competency", "System thinking", "Coding ability", "Product mindset"],
    culturalFit: ["Diverse", "Inclusive", "Collaborative", "Growth-focused"],
    topicsFocus: ["Cloud architecture", ".NET framework", "Enterprise development", "DevOps practices"],
  },
};

export function getCompanyProfile(company: CompanyName): CompanyProfile {
  return companyProfiles[company];
}

export function personalizeAtsAnalysis(keywords: string[], company: CompanyName, role: string): string {
  const profile = getCompanyProfile(company);
  const matched = keywords.filter(k =>
    profile.keywords.some(pk => pk.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(pk.toLowerCase()))
  );
  
  return `This resume shows ${matched.length}/${profile.keywords.length} key ${company} keywords for ${role} role. ` +
    `Focus on: ${profile.skillPriorities.slice(0, 2).join(", ")}. ` +
    `${company} emphasizes ${profile.culturalFit[0]} and ${profile.culturalFit[1]}.`;
}
