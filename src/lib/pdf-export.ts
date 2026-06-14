import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { type FinalReport } from "@/lib/agents";

export async function generatePlacementReportPDF(
  report: FinalReport,
  company: string,
  studentName: string = "Engineering Student"
): Promise<void> {
  console.log("PDF generation started");
  console.log("FinalReport object:", report);

  if (!report) {
    console.error("Invalid FinalReport data");
    throw new Error("Invalid FinalReport data");
  }

  // Current date
  const dateStr = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  const dateObj = new Date();
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const dd = String(dateObj.getDate()).padStart(2, '0');
  const fileNameDate = `${yyyy}_${mm}_${dd}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Placement Readiness Report</title>
      <style>
        * { box-sizing: border-box; }
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          color: #111827;
          line-height: 1.5;
          background: white;
          margin: 0;
          padding: 0;
        }
        .page {
          page-break-after: always;
          padding: 40px 60px;
          max-width: 800px;
          margin: 0 auto;
        }
        .page:last-child {
          page-break-after: auto;
        }
        .title-page {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 800px;
          text-align: center;
        }
        .title-page h1 { font-size: 48px; color: #1e3a8a; margin-bottom: 10px; }
        .title-page h2 { font-size: 28px; color: #374151; margin-bottom: 40px; font-weight: normal; }
        .title-page .meta { font-size: 18px; color: #4b5563; margin: 10px 0; }
        .title-page .big-score {
          margin-top: 60px;
          padding: 30px;
          border: 4px solid #1e3a8a;
          border-radius: 12px;
          display: inline-block;
        }
        .title-page .big-score span { font-size: 64px; font-weight: bold; color: #1e3a8a; }
        .title-page .big-score div { font-size: 16px; text-transform: uppercase; color: #6b7280; font-weight: bold; margin-bottom: 5px; }

        h2.section-title {
          font-size: 24px;
          color: #1e3a8a;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 8px;
          margin-top: 40px;
          margin-bottom: 20px;
        }
        h3 { font-size: 18px; color: #1f2937; margin-top: 20px; margin-bottom: 10px; }
        p { margin-bottom: 12px; color: #374151; font-size: 14px; }
        ul { margin-bottom: 15px; padding-left: 20px; font-size: 14px; color: #374151; }
        li { margin-bottom: 6px; }

        .kpi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
        .kpi-card { background: #f3f4f6; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; }
        .kpi-label { font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: bold; margin-bottom: 5px; }
        .kpi-value { font-size: 24px; font-weight: bold; color: #1e3a8a; }

        .roadmap-week {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
        }
        .roadmap-week h4 { margin: 0 0 10px 0; color: #0f172a; font-size: 16px; }
      </style>
    </head>
    <body>

      <!-- TITLE PAGE -->
      <div class="page title-page">
        <h1>Place AI</h1>
        <h2>Agentic Placement Preparation Report</h2>
        <div class="meta"><strong>Candidate:</strong> ${studentName}</div>
        <div class="meta"><strong>Generated Date:</strong> ${dateStr}</div>
        <div class="meta"><strong>Target Role:</strong> ${report.role} at ${company}</div>
        <div class="big-score">
          <div>Overall Placement Readiness Score</div>
          <span>${report.overallScore}%</span>
        </div>
      </div>

      <!-- EXECUTIVE SUMMARY & RESUME -->
      <div class="page">
        <h2 class="section-title">Executive Summary</h2>
        <div class="kpi-grid">
          <div class="kpi-card"><div class="kpi-label">Overall Readiness Score</div><div class="kpi-value">${report.overallScore}%</div></div>
          <div class="kpi-card"><div class="kpi-label">Resume Score</div><div class="kpi-value">${(report.resumeScore * 10).toFixed(0)}%</div></div>
          <div class="kpi-card"><div class="kpi-label">ATS Score</div><div class="kpi-value">${report.atsScore.toFixed(0)}%</div></div>
          <div class="kpi-card"><div class="kpi-label">Placement Readiness Score</div><div class="kpi-value">${report.placementReadiness}%</div></div>
        </div>
        <p>
          ${studentName} is ${report.placementReadiness > 75 ? "well-prepared" : "moderately prepared"} for placement in ${report.role} positions at ${company}. 
          With an overall assessment score of <strong>${report.overallScore}/100</strong>, the candidate demonstrates ${report.resumeScore > 7 ? "strong" : "moderate"} resume fundamentals and ${report.atsScore > 75 ? "excellent" : "good"} ATS compatibility. 
          Targeted improvements in identified skill gaps and successful execution of the 30-day roadmap will maximize the probability of placement success.
        </p>

        <h2 class="section-title">Resume Analysis</h2>
        <p><strong>Resume Score:</strong> ${report.resume.score}/10</p>
        <div style="display: flex; gap: 20px;">
          <div style="flex: 1;">
            <h3>Strengths</h3>
            <ul>${report.resume.strengths.map(s => `<li>${s}</li>`).join("")}</ul>
          </div>
          <div style="flex: 1;">
            <h3>Weaknesses</h3>
            <ul>${report.resume.weaknesses.map(w => `<li>${w}</li>`).join("")}</ul>
          </div>
        </div>
        <h3>Missing Sections</h3>
        <ul>${report.resume.missingSections.length > 0 ? report.resume.missingSections.map(s => `<li>${s}</li>`).join("") : "<li>None identified.</li>"}</ul>
        <h3>Skill Analysis</h3>
        <p>${report.resume.skillAnalysis}</p>
        <h3>Project Evaluation</h3>
        <p>${report.resume.projectEvaluation}</p>
        <h3>Recommendations</h3>
        <ul>${report.resume.improvements.map(i => `<li>${i}</li>`).join("")}</ul>
      </div>

      <!-- ATS ANALYSIS -->
      <div class="page">
        <h2 class="section-title">ATS Analysis</h2>
        <p><strong>ATS Score:</strong> ${report.ats.atsScore}/100</p>
        <p><strong>Keyword Match Percentage:</strong> ${report.ats.keywordMatch}%</p>
        <p><strong>Role Compatibility:</strong> ${report.ats.roleCompatibility}</p>
        
        <h3>Missing Keywords</h3>
        <ul>${report.ats.missingKeywords.length > 0 ? report.ats.missingKeywords.map(k => `<li>${k}</li>`).join("") : "<li>None identified.</li>"}</ul>
        
        <h3>Skill Gaps</h3>
        <ul>${report.ats.skillGaps.length > 0 ? report.ats.skillGaps.map(g => `<li>${g}</li>`).join("") : "<li>None identified.</li>"}</ul>

        <h3>ATS Recommendations</h3>
        <ul>${report.ats.suggestions.length > 0 ? report.ats.suggestions.map(s => `<li>${s}</li>`).join("") : "<li>None identified.</li>"}</ul>

        <h2 class="section-title">Skill Gap Assessment</h2>
        <p><strong>Current Skills:</strong> ${report.ats.matchedKeywords.join(", ") || "None explicitly identified"}</p>
        <p><strong>Missing Skills:</strong> ${report.ats.missingKeywords.join(", ") || "None identified"}</p>
        <p><strong>Recommended Skills:</strong> ${report.roadmap.skillGaps.join(", ") || "None identified"}</p>
        
        <h3>Priority Areas</h3>
        <ul>${report.ats.skillGaps.slice(0, 3).map(g => `<li><strong>${g}</strong>: Critical for ${company} requirements.</li>`).join("") || "<li>No critical gaps identified.</li>"}</ul>
      </div>

      <!-- CAREER ROADMAP & PROJECTS -->
      <div class="page">
        <h2 class="section-title">30-Day Career Roadmap</h2>
        ${report.roadmap.weeks.map(week => `
          <div class="roadmap-week">
            <h4>Week ${week.week}: ${week.focus}</h4>
            <p><strong>Tasks:</strong></p>
            <ul>${week.tasks.map(t => `<li>${t}</li>`).join("")}</ul>
            <p><strong>Resources:</strong></p>
            <ul>${week.resources.map(r => `<li>${r}</li>`).join("")}</ul>
          </div>
        `).join("")}

        <h2 class="section-title">Recommended Projects</h2>
        ${report.roadmap.projects.map(p => `
          <h3>${p.title}</h3>
          <p>${p.description}</p>
        `).join("")}
      </div>

      <!-- INTERVIEW & RECOMMENDATIONS -->
      <div class="page">
        <h2 class="section-title">Interview Preparation Plan</h2>
        <p>The following topics are tailored for ${company} interview processes:</p>
        <ul>${report.roadmap.interviewPlan.map(plan => `<li>${plan}</li>`).join("")}</ul>

        <h2 class="section-title">Final Recommendations</h2>
        <h3>Top 5 Next Steps</h3>
        <ol style="margin-left: 20px; font-size: 14px; color: #374151;">
          ${report.nextSteps.slice(0, 5).map(step => `<li style="margin-bottom: 8px;">${step}</li>`).join("")}
        </ol>

        <h3>Placement Readiness Conclusion</h3>
        <p>
          Based on the multi-agent analysis, the candidate is currently performing at a <strong>${report.placementReadiness}% readiness level</strong>. 
          By prioritizing the top 5 next steps and adhering strictly to the 30-day roadmap, the candidate will significantly bridge existing skill gaps and improve overall ATS compatibility. Focus heavily on <strong>${report.ats.skillGaps[0] || "core technical concepts"}</strong> to meet the specific engineering standards of ${company}.
        </p>
      </div>

    </body>
    </html>
  `;

  const element = document.createElement("div");
  element.innerHTML = html;
  
  element.style.position = "absolute";
  element.style.top = "-9999px";
  element.style.width = "800px";
  document.body.appendChild(element);

  try {
    const pages = Array.from(element.querySelectorAll(".page")) as HTMLElement[];
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const canvas = await html2canvas(page, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      
      const imgProps = pdf.getImageProperties(imgData);
      const ratio = imgProps.width / imgProps.height;
      const renderHeight = pdfWidth / ratio;
      
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, renderHeight);
    }

    pdf.save(`PlaceAI_Report_${fileNameDate}.pdf`);
    console.log("PDF generation completed");
  } catch (error) {
    console.error("PDF generation error:", error);
    throw error;
  } finally {
    document.body.removeChild(element);
  }
}
