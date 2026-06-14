# 🚀 Place AI – Agentic Placement Preparation Assistant

## 📌 Overview
Place AI is a multi-agent AI-powered placement preparation platform designed to help students improve their employability and placement readiness.

The system uses a Coordinator Agent to orchestrate three specialized AI agents:

- Resume Agent
- ATS Agent
- Career Roadmap Agent

These agents collaborate to analyze resumes, evaluate ATS compatibility, identify skill gaps, and generate personalized career preparation roadmaps.

The project leverages Google's Gemini AI model for intelligent reasoning and report generation.

---

## 🎯 Problem Statement
Many students struggle with:

- Creating ATS-friendly resumes
- Identifying skill gaps
- Understanding placement readiness
- Preparing effectively for specific job roles

Existing tools often solve only one of these problems.

Place AI provides a unified AI-driven solution through a multi-agent architecture.

---

## ✨ Features

### 📄 Resume Analysis Agent
Analyzes uploaded resumes and provides:

- Resume Score
- Strengths
- Weaknesses
- Missing Sections
- Skill Analysis
- Project Evaluation
- Improvement Suggestions

---

### 🎯 ATS Optimization Agent
Evaluates resumes against target job roles.

Provides:

- ATS Score
- Keyword Match Percentage
- Missing Keywords
- Skill Gaps
- Role Compatibility
- ATS Improvement Recommendations

---

### 🛣️ Career Roadmap Agent
Generates personalized preparation plans.

Provides:

- Skill Gap Analysis
- 30-Day Learning Roadmap
- Recommended Projects
- Interview Preparation Plan
- Placement Readiness Score

---

### 🤖 Coordinator Agent
Acts as the central orchestrator.

Responsibilities:

1. Receives user inputs.
2. Executes Resume Agent.
3. Executes ATS Agent.
4. Executes Career Roadmap Agent.
5. Aggregates results.
6. Generates the final Placement Readiness Report.

---

## 🏗️ System Architecture

```
User
  │
  ▼
Coordinator Agent
  │
  ├── Resume Agent
  ├── ATS Agent
  └── Career Roadmap Agent
  │
  ▼
Google Gemini AI
  │
  ▼
Placement Readiness Report
```

---

## 🧠 Agent Workflow

```
Upload Resume
      │
      ▼
Resume Agent
      │
      ▼
ATS Agent
      │
      ▼
Career Roadmap Agent
      │
      ▼
Coordinator Aggregation
      │
      ▼
Final Placement Report
```

---

## 🛠️ Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

### UI Components

- Radix UI
- Framer Motion
- Recharts

### AI Layer

- Google Gemini API
- Multi-Agent Orchestration

### Resume Processing

- PDF.js

### Version Control

- Git
- GitHub

---

## 📊 Generated Outputs
The system generates:

### Resume Analysis

- Resume Score
- Strengths
- Weaknesses
- Missing Sections

### ATS Analysis

- ATS Score
- Keyword Match
- Missing Keywords
- Skill Gap Detection

### Career Planning

- Weekly Learning Roadmap
- Project Recommendations
- Interview Preparation Plan

### Final Report

- Overall Placement Readiness Score
- Resume Score
- ATS Score
- Career Readiness Score
- Recommended Next Steps

---

## ⚙️ Installation
Clone the repository:

```
git clone https://github.com/HemalathaSV/placement-ai-pro.git
```
Navigate to the project:

```
cd placement-ai-pro
```
Install dependencies:

```
npm install
```
Start development server:

```
npm run dev
```

---

## 🔑 Gemini API Setup
Create a Gemini API Key from:

[https://aistudio.google.com](https://aistudio.google.com/)

The application supports:

- Environment Variables
- Runtime Settings Configuration

Example:

```
VITE_GEMINI_API_KEY=YOUR_API_KEY
```

---

## 🚀 Usage

1. Open Place AI.
2. Upload a resume PDF.
3. Select a target role.
4. Run Multi-Agent Analysis.
5. View: Resume Analysis
6. ATS Analysis
7. Career Roadmap
8. Placement Readiness Report

---

## 📈 Future Scope
Potential future enhancements:

- Company Research Agent
- Interview Simulation Agent
- Job Recommendation Agent
- LinkedIn Profile Analyzer
- Voice-Based Interview Assistant
- LangGraph Integration
- CrewAI Integration
- Placement Analytics Dashboard

---

## 🎓 Academic Relevance
This project demonstrates:

- Agentic AI Concepts
- Multi-Agent Systems
- AI Orchestration
- Prompt Engineering
- Resume Intelligence
- Career Recommendation Systems

---

## 👩‍💻 Author
**Hemalatha S V**

Final Year Engineering Student

Project: Place AI – Agentic Placement Preparation Assistant

---

## 📜 License
This project is developed for academic and educational purposes.
