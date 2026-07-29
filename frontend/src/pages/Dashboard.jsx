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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("Dashboard component caught error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="glass-panel rounded-3xl p-8 text-center border border-slate-800 space-y-3">
          <p className="text-white font-bold text-lg">Report Ready</p>
          <p className="text-slate-400 text-xs">Refresh your browser page to view updated report metrics.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

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
      const data = await getHistory(user?.id);
      const list = data || [];
      setHistory(list);

      if (list.length > 0) {
        const latest = list[0];
        if (latest.analysis && (latest.analysis.ats || latest.analysis.success)) {
          setAnalysisResult(latest.analysis);
        }
      } else {
        // When history is empty (e.g. after user deletes all history), clear the dashboard report
        setAnalysisResult(null);
      }
    } catch (error) {
      console.error("History Error:", error);
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
      <ErrorBoundary>
        <div className="space-y-8">
          {/* Welcome Header */}
          <div className="relative overflow-hidden rounded-3xl glass-panel p-8 sm:p-10 border border-slate-800 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold">
                  ⚡ {mode === "candidate" ? "Candidate ATS Optimization Hub" : "Recruiter Batch Screening Portal"}
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white">
                  {mode === "candidate" ? `Welcome Back, ${candidateName}!` : "Recruiter Hiring Intelligence"}
                </h1>
                <p className="text-slate-400 text-sm max-w-2xl">
                  {mode === "candidate"
                    ? "Upload your resume & job description to compute ATS match score, generate STAR bullets & AI cover letters."
                    : "Upload batch candidate resumes against 1 job description to generate sorted candidate leaderboards."}
                </p>
              </div>

              {/* Mode Switcher */}
              <div className="flex bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
                <button
                  onClick={() => setMode("candidate")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    mode === "candidate"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg glow-cyan"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <FaUserCheck /> Candidate Mode
                </button>
                <button
                  onClick={() => setMode("recruiter")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    mode === "recruiter"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg glow-purple"
                      : "text-slate-400 hover:text-white"
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
              className="glass-panel glass-panel-hover p-4 rounded-2xl border border-slate-800 text-left space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg border border-amber-500/30 group-hover:scale-110 transition-transform">
                <FaMagic />
              </div>
              <p className="text-xs font-bold text-white">STAR Bullet Enhancer</p>
              <p className="text-[10px] text-slate-400">Rewrite bullet points with metrics</p>
            </button>

            <button
              onClick={() => setShowCoverLetter(true)}
              className="glass-panel glass-panel-hover p-4 rounded-2xl border border-slate-800 text-left space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-lg border border-purple-500/30 group-hover:scale-110 transition-transform">
                <FaEnvelopeOpenText />
              </div>
              <p className="text-xs font-bold text-white">AI Cover Letter</p>
              <p className="text-[10px] text-slate-400">Generate 1-click tailored letter</p>
            </button>

            <button
              onClick={() => setShowVersionComparer(true)}
              className="glass-panel glass-panel-hover p-4 rounded-2xl border border-slate-800 text-left space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg border border-emerald-500/30 group-hover:scale-110 transition-transform">
                <FaExchangeAlt />
              </div>
              <p className="text-xs font-bold text-white">A/B Version Comparer</p>
              <p className="text-[10px] text-slate-400">Track score improvement deltas</p>
            </button>

            <button
              onClick={() => setMode(mode === "candidate" ? "recruiter" : "candidate")}
              className="glass-panel glass-panel-hover p-4 rounded-2xl border border-slate-800 text-left space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center text-lg border border-pink-500/30 group-hover:scale-110 transition-transform">
                {mode === "candidate" ? <FaUsers /> : <FaUserCheck />}
              </div>
              <p className="text-xs font-bold text-white">{mode === "candidate" ? "Switch to Recruiter" : "Switch to Candidate"}</p>
              <p className="text-[10px] text-slate-400">{mode === "candidate" ? "Screen multiple resumes" : "Individual ATS analysis"}</p>
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
                  <div className="glass-panel rounded-3xl p-10 text-center border border-slate-800 space-y-3">
                    <div className="text-5xl mb-2">🤖</div>
                    <h3 className="text-xl font-bold text-white">Ready for Analysis</h3>
                    <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
                      Upload a resume and job description above to generate your comprehensive ATS score & AI review report.
                    </p>
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
      </ErrorBoundary>

      {/* Tool Modals */}
      <BulletEnhancerModal isOpen={showBulletEnhancer} onClose={() => setShowBulletEnhancer(false)} />
      <CoverLetterModal isOpen={showCoverLetter} onClose={() => setShowCoverLetter(false)} />
      <VersionComparerModal isOpen={showVersionComparer} onClose={() => setShowVersionComparer(false)} />
    </DashboardLayout>
  );
}

export default Dashboard;