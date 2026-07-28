import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { getHistory, deleteHistory } from "../services/historyService";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  FaFileAlt,
  FaCalendarAlt,
  FaChartLine,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaEye,
  FaTrash,
  FaSync,
} from "react-icons/fa";

function History() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, [user]);

  async function loadHistory() {
    setLoading(true);
    try {
      const data = await getHistory(user?.id);
      setHistory(data || []);
    } catch (e) {
      console.error("Error loading history:", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this analysis report?")) return;
    try {
      await deleteHistory(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (e) {
      console.error("Error deleting history:", e);
    }
  }

  const getBadgeColor = (recommendation) => {
    if (!recommendation) return "bg-slate-700 text-slate-300";
    switch (recommendation.toLowerCase()) {
      case "hire":
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
      case "maybe":
      case "consider":
        return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
      case "reject":
        return "bg-rose-500/20 text-rose-400 border border-rose-500/30";
      default:
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
    }
  };

  const getBadgeIcon = (recommendation) => {
    if (!recommendation) return <FaExclamationCircle />;
    switch (recommendation.toLowerCase()) {
      case "hire":
        return <FaCheckCircle />;
      case "maybe":
      case "consider":
        return <FaExclamationCircle />;
      case "reject":
        return <FaTimesCircle />;
      default:
        return <FaChartLine />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl shadow-lg shadow-blue-500/20">
              <FaFileAlt />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white">Resume History</h1>
              <p className="text-slate-400 text-sm">View and manage all previous AI resume analysis reports</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
              {history.length} Analysis Reports
            </span>
            <button
              onClick={loadHistory}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all flex items-center gap-2 text-xs font-semibold"
            >
              <FaSync className={loading ? "animate-spin text-blue-400" : ""} /> Refresh
            </button>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-16 text-center text-slate-300">
            <div className="w-12 h-12 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin mx-auto mb-4"></div>
            <p className="font-semibold text-lg">Loading History Logs...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-16 text-center">
            <div className="text-6xl mb-4">📄</div>
            <h2 className="text-2xl font-extrabold text-white mb-2">No Saved History Yet</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
              When you upload and analyze resumes, your ATS scores and report logs will appear here for easy comparison.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-blue-500/20 transition-all"
            >
              Analyze Your First Resume
            </button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {history.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-slate-700 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  {/* Info Column */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-2xl flex-shrink-0">
                        📄
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white leading-snug">
                          {item.resume_name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                          <FaCalendarAlt size={12} className="text-slate-500" />
                          <span>{item.uploaded_at ? new Date(item.uploaded_at).toLocaleString() : "Recently"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-2">
                      <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ATS Score</p>
                        <p className="text-2xl font-extrabold text-blue-400 mt-0.5">{item.ats_score}%</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Job Match</p>
                        <p className="text-2xl font-extrabold text-emerald-400 mt-0.5">{item.job_match}%</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recommendation</p>
                        <span className={`inline-flex items-center gap-1 mt-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${getBadgeColor(item.recommendation)}`}>
                          {getBadgeIcon(item.recommendation)}
                          {item.recommendation || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex sm:flex-col gap-2 w-full lg:w-auto">
                    <button
                      onClick={() => navigate(`/history/${item.id}`)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all"
                    >
                      <FaEye size={14} /> View Report
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 text-xs font-bold transition-all"
                    >
                      <FaTrash size={14} /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default History;