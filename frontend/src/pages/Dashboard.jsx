import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { FaMagic, FaEnvelopeOpenText, FaUsers, FaExchangeAlt, FaUserCheck } from "react-icons/fa";

import ResumeUpload from "../components/ResumeUpload";
import AnalysisResult from "../components/AnalysisResult";
import DashboardStats from "../components/DashboardStats";
import RecentActivity from "../components/RecentActivity";
import RecruiterBatchSection from "../components/RecruiterBatchSection";
import BulletEnhancerModal from "../components/BulletEnhancerModal";
import CoverLetterModal from "../components/CoverLetterModal";
import VersionComparerModal from "../components/VersionComparerModal";

import { getHistory } from "../services/historyService";

function Dashboard() {
  const { user } = useAuth();

  const [mode, setMode] = useState("candidate"); // 'candidate' | 'recruiter'
  const [analysisResult, setAnalysisResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showBulletEnhancer, setShowBulletEnhancer] = useState(false);
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [showVersionComparer, setShowVersionComparer] = useState(false);

  const candidateName =
    localStorage.getItem("candidate_name") ||
    user?.user_metadata?.full_name ||
    (user?.email ? user.email.split("@")[0] : "Candidate");

  const loadHistory = async () => {
    try {
      setLoading(true);
      const userKey = user?.email || user?.id || localStorage.getItem("candidate_email") || localStorage.getItem("candidate_id");
      const data = await getHistory(userKey);
      const list = data || [];
      setHistory(list);

      if (list.length > 0) {
        const latest = list[0];
        if (latest.analysis && (latest.analysis.ats || latest.analysis.success)) {
          setAnalysisResult(latest.analysis);
        } else {
          setAnalysisResult(null);
        }
      } else {
        // When history is empty (e.g. new user or after user deletes all history), clear the dashboard report
        setAnalysisResult(null);
      }
    } catch (error) {
      console.error("History Error:", error);
      setHistory([]);
      setAnalysisResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [user]);

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
    loadHistory();
    setTimeout(() => {
      window.scrollTo({ top: 500, behavior: "smooth" });
    }, 100);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
          {/* Welcome Header */}
          <div className="relative overflow-hidden rounded-3xl bg-zinc-950 p-8 sm:p-10 border border-zinc-800 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 text-green-300 border border-green-400/30 text-xs font-bold">
                  ⚡ {mode === "candidate" ? "Candidate ATS Optimization Hub" : "Recruiter Batch Screening Portal"}
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white">
                  {mode === "candidate" ? `Welcome Back, ${candidateName}!` : "Recruiter Hiring Intelligence"}
                </h1>
                <p className="text-zinc-400 text-sm max-w-2xl">
                  {mode === "candidate"
                    ? "Upload your resume & job description to compute ATS match score, generate STAR bullets & AI cover letters."
                    : "Upload batch candidate resumes against 1 job description to generate sorted candidate leaderboards."}
                </p>
              </div>

              {/* Mode Switcher */}
              <div className="flex bg-black p-1.5 rounded-2xl border border-zinc-800">
                <button
                  onClick={() => setMode("candidate")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    mode === "candidate"
                      ? "bg-green-400 text-black shadow-lg shadow-green-400/20"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <FaUserCheck /> Candidate Mode
                </button>
                <button
                  onClick={() => setMode("recruiter")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    mode === "recruiter"
                      ? "bg-green-400 text-black shadow-lg shadow-green-400/20"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <FaUsers /> Recruiter Mode
                </button>
              </div>
            </div>
          </div>

          {/* Quick Tools Launch Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button
              onClick={() => setShowBulletEnhancer(true)}
              className="bg-zinc-950 hover:bg-zinc-900 p-4 rounded-2xl border border-zinc-800 hover:border-green-400/40 text-left space-y-2 group transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-green-400/30 text-green-400 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                <FaMagic />
              </div>
              <p className="text-xs font-bold text-white">STAR Bullet Enhancer</p>
              <p className="text-[10px] text-zinc-400">Rewrite bullet points with metrics</p>
            </button>

            <button
              onClick={() => setShowCoverLetter(true)}
              className="bg-zinc-950 hover:bg-zinc-900 p-4 rounded-2xl border border-zinc-800 hover:border-green-400/40 text-left space-y-2 group transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-green-400/30 text-green-400 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                <FaEnvelopeOpenText />
              </div>
              <p className="text-xs font-bold text-white">AI Cover Letter</p>
              <p className="text-[10px] text-zinc-400">Generate 1-click tailored letter</p>
            </button>

            <button
              onClick={() => setShowVersionComparer(true)}
              className="bg-zinc-950 hover:bg-zinc-900 p-4 rounded-2xl border border-zinc-800 hover:border-green-400/40 text-left space-y-2 group transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-green-400/30 text-green-400 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                <FaExchangeAlt />
              </div>
              <p className="text-xs font-bold text-white">A/B Version Comparer</p>
              <p className="text-[10px] text-zinc-400">Track score improvement deltas</p>
            </button>

            <button
              onClick={() => setMode(mode === "candidate" ? "recruiter" : "candidate")}
              className="bg-zinc-950 hover:bg-zinc-900 p-4 rounded-2xl border border-zinc-800 hover:border-green-400/40 text-left space-y-2 group transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-green-400/30 text-green-400 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                {mode === "candidate" ? <FaUsers /> : <FaUserCheck />}
              </div>
              <p className="text-xs font-bold text-white">{mode === "candidate" ? "Switch to Recruiter" : "Switch to Candidate"}</p>
              <p className="text-[10px] text-zinc-400">{mode === "candidate" ? "Screen multiple resumes" : "Individual ATS analysis"}</p>
            </button>
          </div>

          {/* Stats Grid */}
          <div>
            <DashboardStats history={history} mode={mode} />
          </div>

          {/* Main Operational Mode Section */}
          {mode === "recruiter" ? (
            <div>
              <RecruiterBatchSection />
            </div>
          ) : (
            <>
              <div>
                <ResumeUpload onAnalysisComplete={handleAnalysisComplete} />
              </div>

              <div>
                {analysisResult ? (
                  <AnalysisResult result={analysisResult} />
                ) : (
                  <div className="bg-zinc-950 rounded-3xl p-10 sm:p-14 text-center border border-zinc-800 space-y-4 shadow-xl">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-green-400/30 flex items-center justify-center text-3xl mx-auto text-green-300 shadow-lg shadow-green-400/10">
                      📄
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl sm:text-2xl font-black text-white">No Resume Analyzed Yet</h3>
                      <p className="text-zinc-400 text-xs sm:text-sm max-w-lg mx-auto">
                        Upload your resume and enter a target job description above to generate your real-time ATS match score, keyword breakdown, STAR bullets, and AI review.
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-400">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                      Ready to analyze your first resume
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Recent Activity */}
          {mode === "candidate" && (
            <div>
              <RecentActivity history={history} />
            </div>
          )}
        </div>

      {/* Tool Modals */}
      <BulletEnhancerModal isOpen={showBulletEnhancer} onClose={() => setShowBulletEnhancer(false)} />
      <CoverLetterModal isOpen={showCoverLetter} onClose={() => setShowCoverLetter(false)} />
      <VersionComparerModal isOpen={showVersionComparer} onClose={() => setShowVersionComparer(false)} />
    </DashboardLayout>
  );
}

export default Dashboard;