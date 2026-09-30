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
    if (!recommendation) return "bg-zinc-900 text-zinc-400 border border-zinc-800";
    switch (recommendation.toLowerCase()) {
      case "hire":
      case "strong hire":
      case "fit":
        return "bg-green-400/20 text-green-300 border border-green-400/40";
      case "maybe":
      case "consider":
        return "bg-zinc-800 text-zinc-300 border border-zinc-700";
      case "reject":
        return "bg-zinc-900 text-zinc-400 border border-zinc-800";
      default:
        return "bg-green-400/10 text-green-400 border border-green-400/20";
    }
  };

  const getBadgeIcon = (recommendation) => {
    if (!recommendation) return <FaExclamationCircle />;
    switch (recommendation.toLowerCase()) {
      case "hire":
      case "strong hire":
      case "fit":
        return <FaCheckCircle className="text-green-400" />;
      case "maybe":
      case "consider":
        return <FaExclamationCircle className="text-zinc-400" />;
      case "reject":
        return <FaTimesCircle className="text-zinc-500" />;
      default:
        return <FaChartLine className="text-green-400" />;
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
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-green-400/30 flex items-center justify-center text-green-300 text-xl shadow-lg shadow-green-400/10">
              <FaFileAlt />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">Resume History</h1>
              <p className="text-zinc-400 text-sm">View and manage all previous AI resume analysis reports</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-300 text-xs font-semibold border border-zinc-800">
              {history.length} Analysis Reports
            </span>
            <button
              onClick={loadHistory}
              className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-all flex items-center gap-2 text-xs font-semibold"
            >
              <FaSync className={loading ? "animate-spin text-green-400" : ""} /> Refresh
            </button>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-16 text-center text-zinc-300 space-y-4">
            <div className="w-10 h-10 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="font-bold text-base text-zinc-200">Loading History Logs...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-16 text-center">
            <div className="text-6xl mb-4">📄</div>
            <h2 className="text-2xl font-black text-white mb-2">No Saved History Yet</h2>
            <p className="text-zinc-400 text-sm max-w-md mx-auto mb-6">
              When you upload and analyze resumes, your ATS scores and report logs will appear here for easy comparison.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 rounded-xl bg-green-400 hover:bg-green-300 text-black font-black text-sm shadow-xl shadow-green-400/20 transition-all"
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
                className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl hover:border-zinc-700 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  {/* Info Column */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-green-400/30 text-green-300 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                        📄
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white leading-snug">
                          {item.resume_name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                          <FaCalendarAlt size={12} className="text-zinc-500" />
                          <span>{item.uploaded_at ? new Date(item.uploaded_at).toLocaleString() : "Recently"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-2">
                      <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">ATS Score</p>
                        <p className="text-2xl font-black text-green-400 mt-0.5">{item.ats_score}%</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Job Match</p>
                        <p className="text-2xl font-black text-white mt-0.5">{item.job_match}%</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Recommendation</p>
                        <span className={`inline-flex items-center gap-1.5 mt-1.5 px-3 py-1 rounded-full text-xs font-bold ${getBadgeColor(item.recommendation)}`}>
                          {getBadgeIcon(item.recommendation)}
                          {item.recommendation || "Evaluated"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex sm:flex-col gap-2 w-full lg:w-auto">
                    <button
                      onClick={() => navigate(`/history/${item.id}`)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-green-400 hover:bg-green-300 text-black text-xs font-black shadow-lg shadow-green-400/20 transition-all"
                    >
                      <FaEye size={14} /> View Report
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 text-xs font-bold transition-all"
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