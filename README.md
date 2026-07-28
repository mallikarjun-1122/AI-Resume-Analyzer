# ⚡ AI Resume & Hiring Intelligence Suite

![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?logo=tailwind-css&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E44AD?logo=google&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-Deployed-46E3B7?logo=render&logoColor=white)

An **end-to-end, dual-sided AI platform** designed for both job candidates and recruiters. Evaluates resume ATS compatibility against job descriptions, provides domain skill gap breakdowns, generates STAR method bullet enhancements, produces 1-click tailored cover letters, and features a recruiter batch screening leaderboard.

🚀 **Live Application Demo**: [https://ai-resume-analyzer-tan-xi.vercel.app](https://ai-resume-analyzer-tan-xi.vercel.app)  
📦 **Backend Service API**: [https://ai-resume-analyzer-d9kc.onrender.com](https://ai-resume-analyzer-d9kc.onrender.com)

---

## 🔥 Key Features

### 👤 Candidate Features (B2C)
- 📄 **Multi-Format Document Parsing**: Native extraction from both `.pdf` and `.docx` resumes.
- 🎯 **ATS Compatibility Gauge**: Calculates overall ATS fit (0–100%) based on keyword density and section structure.
- 📊 **Skill Category Visualizer**: Domain breakdowns across Programming Languages, Frameworks, Databases/Cloud, and Soft Skills.
- ⚡ **AI Bullet Point Enhancer (STAR Method)**: Converts weak bullet points into metric-driven STAR format achievements.
- ✉️ **1-Click AI Cover Letter Generator**: Produces 3-paragraph tailored cover letters with TXT export and copy features.
- 📈 **A/B Resume Version Comparer**: Compare Version A vs Version B to track score improvements over time.
- 🎤 **Tailored AI Interview Q&A**: Generates role-specific behavioral interview questions with preparation tips.

### 👥 Recruiter Features (B2B)
- 🏆 **Batch Candidate Leaderboard**: Upload 3–5 candidate resumes at once against 1 job description to get a ranked, sorted leaderboard.

---

## 🛠️ Technology Stack

| Layer | Technology Used |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Framer Motion, React Icons |
| **Backend** | Python 3, FastAPI, Uvicorn, Pydantic, spaCy, pdfplumber, python-docx |
| **AI Engine** | Google Gemini 2.5 Flash API (with structural fallback engine) |
| **Database & Storage** | Supabase (PostgreSQL) + LocalStorage Fallback |
| **Export Utilities** | `html2canvas` + `jsPDF` for downloadable PDF reports |
| **Hosting** | Vercel (Frontend) + Render (Backend Web Service) |

---

## 🏗️ System Architecture

```
                       +-----------------------------------+
                       |    React 19 Frontend (Vercel)     |
                       +-----------------------------------+
                                         |
                                  REST API / HTTPS
                                         |
                       +-----------------------------------+
                       |     FastAPI Backend (Render)      |
                       +-----------------------------------+
                                 /               \
                                /                 \
             +-----------------------+   +-----------------------+
             | Google Gemini AI API  |   |   Supabase Postgres   |
             +-----------------------+   +-----------------------+
```

---

## 🚀 Local Installation & Setup Guide

### 1. Prerequisites
- Node.js (v18+) & `npm`
- Python (v3.10+)

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo GEMINI_API_KEY="YOUR_GEMINI_API_KEY" > .env

# Run FastAPI server
uvicorn app.main:app --reload --port 8000
```
Backend Swagger API docs will be available at: `http://127.0.0.1:8000/docs`

---

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
echo VITE_API_URL="http://127.0.0.1:8000" > .env

# Run Vite development server
npm run dev
```
Frontend application will be available at: `http://localhost:5173`

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/analyze` | Single resume analysis against job description |
| `POST` | `/batch-analyze` | Recruiter mode: multi-resume screening leaderboard |
| `POST` | `/enhance-bullet` | STAR method AI bullet point enhancer |
| `POST` | `/generate-cover-letter` | 1-click tailored cover letter generator |

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

⭐ **If you like this project, please give it a star on GitHub!**
