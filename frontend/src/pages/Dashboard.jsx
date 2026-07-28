import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { FaMagic, FaEnvelopeOpenText, FaUsers, FaExchangeAlt, FaRocket, FaUserCheck } from "react-icons/fa";

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

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await getHistory(user?.id);
      setHistory(data || []);
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
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <DashboardLayout>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8"
      >
        {/* Welcome Header */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-3xl glass-panel p-8 sm:p-10 border border-slate-800 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold">
                ⚡ Academic Mini Project Engine v2.0
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white">
                Welcome Back, Candidate!
              </h1>
              <p className="text-slate-400 text-sm max-w-2xl">
                AI Resume & Hiring Intelligence Suite • ATS Scoring, STAR Bullet Enhancer, Cover Letters & Recruiter Screening
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
        </motion.div>

        {/* Quick Tools Launch Bar */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
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
            onClick={() => setMode("recruiter")}
            className="glass-panel glass-panel-hover p-4 rounded-2xl border border-slate-800 text-left space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center text-lg border border-pink-500/30 group-hover:scale-110 transition-transform">
              <FaUsers />
            </div>
            <p className="text-xs font-bold text-white">Batch Leaderboard</p>
            <p className="text-[10px] text-slate-400">Screen multiple resumes at once</p>
          </button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants}>
          <DashboardStats history={history} />
        </motion.div>

        {/* Main Operational Mode Section */}
        {mode === "recruiter" ? (
          <motion.div variants={itemVariants}>
            <RecruiterBatchSection />
          </motion.div>
        ) : (
          <>
            <motion.div variants={itemVariants}>
              <ResumeUpload onAnalysisComplete={handleAnalysisComplete} />
            </motion.div>

            <motion.div variants={itemVariants}>
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
            </motion.div>
          </>
        )}

        {/* Recent Activity */}
        <motion.div variants={itemVariants}>
          <RecentActivity history={history} />
        </motion.div>
      </motion.div>

      {/* Tool Modals */}
      <BulletEnhancerModal isOpen={showBulletEnhancer} onClose={() => setShowBulletEnhancer(false)} />
      <CoverLetterModal isOpen={showCoverLetter} onClose={() => setShowCoverLetter(false)} />
      <VersionComparerModal isOpen={showVersionComparer} onClose={() => setShowVersionComparer(false)} />
    </DashboardLayout>
  );
}

export default Dashboard;