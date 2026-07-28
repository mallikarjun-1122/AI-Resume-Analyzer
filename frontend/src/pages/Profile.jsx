import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { getHistory } from "../services/historyService";
import { motion } from "framer-motion";

import {
  FaEnvelope,
  FaIdBadge,
  FaCalendarAlt,
  FaAward,
  FaChartLine,
  FaFileAlt,
  FaBullseye,
} from "react-icons/fa";

function Profile() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    total: 0,
    avgATS: 0,
    highestATS: 0,
    avgMatch: 0,
  });

  const [displayName, setDisplayName] = useState("Candidate");

  useEffect(() => {
    if (user) {
      loadStats();
      setDisplayName(user.user_metadata?.full_name || user.email?.split("@")[0] || "Candidate");
    }
  }, [user]);

  async function loadStats() {
    try {
      const history = await getHistory(user?.id);

      if (!history || history.length === 0) return;

      const total = history.length;

      const avgATS = Math.round(
        history.reduce((sum, item) => sum + (item.ats_score || 0), 0) / total
      );

      const highestATS = Math.max(
        ...history.map((item) => item.ats_score || 0)
      );

      const avgMatch = Math.round(
        history.reduce((sum, item) => sum + (item.job_match || 0), 0) / total
      );

      setStats({
        total,
        avgATS,
        highestATS,
        avgMatch,
      });
    } catch (err) {
      console.error(err);
    }
  }

  const getInitials = (name) => {
    if (!name) return "C";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
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
        className="max-w-5xl mx-auto space-y-8"
      >
        {/* Profile Header */}
        <motion.div
          variants={itemVariants}
          className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-cyan-500/20">
              {getInitials(displayName)}
            </div>

            <div className="text-center sm:text-left space-y-1 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-3xl font-black text-white">{displayName}</h1>
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold">
                  PRO Candidate
                </span>
              </div>
              <p className="text-slate-400 text-sm">{user?.email || "candidate@analyzer.ai"}</p>
              <p className="text-slate-500 text-xs pt-1">
                Account Status: Active • Gemini AI Enabled
              </p>
            </div>
          </div>
        </motion.div>

        {/* Statistics Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <StatCard
            icon={<FaFileAlt />}
            title="Resumes Uploaded"
            value={stats.total}
            gradient="from-cyan-500 to-blue-600"
          />
          <StatCard
            icon={<FaChartLine />}
            title="Average ATS Score"
            value={`${stats.avgATS}%`}
            gradient="from-emerald-500 to-teal-600"
          />
          <StatCard
            icon={<FaAward />}
            title="Highest ATS Score"
            value={`${stats.highestATS}%`}
            gradient="from-purple-500 to-indigo-600"
          />
          <StatCard
            icon={<FaBullseye />}
            title="Average Job Match"
            value={`${stats.avgMatch}%`}
            gradient="from-amber-500 to-rose-600"
          />
        </motion.div>

        {/* Info Rows */}
        <motion.div
          variants={itemVariants}
          className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6"
        >
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <span>📋</span> Account Details
          </h2>

          <div className="space-y-3">
            <InfoRow icon={<FaEnvelope className="text-cyan-400" />} title="Email Address" value={user?.email || "candidate@analyzer.ai"} />
            <InfoRow icon={<FaIdBadge className="text-purple-400" />} title="User ID" value={user?.id || "demo-user-123"} />
            <InfoRow icon={<FaCalendarAlt className="text-emerald-400" />} title="Account Type" value="Pro Candidate Access" />
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          variants={itemVariants}
          className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6"
        >
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <span>🏆</span> Profile Milestones
          </h2>

          <div className="grid sm:grid-cols-3 gap-4">
            <Badge title="First Analysis Completed" active={stats.total > 0} icon="📄" />
            <Badge title="High ATS Score (>85%)" active={stats.highestATS >= 85} icon="🎯" />
            <Badge title="Power User (5+ Resumes)" active={stats.total >= 5} icon="💪" />
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}

function StatCard({ icon, title, value, gradient }) {
  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-center space-y-2">
      <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center text-lg shadow-md`}>
        {icon}
      </div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{title}</p>
      <p className="text-3xl font-black text-white">{value}</p>
    </div>
  );
}

function InfoRow({ icon, title, value }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
      <div className="text-xl">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-400">{title}</p>
        <p className="text-sm font-semibold text-slate-200 truncate">{value}</p>
      </div>
    </div>
  );
}

function Badge({ title, active, icon }) {
  return (
    <div
      className={`p-5 rounded-2xl text-center space-y-2 border transition-all ${
        active
          ? "bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border-cyan-500/40 text-white shadow-lg glow-cyan"
          : "bg-slate-900/40 border-slate-800 text-slate-500"
      }`}
    >
      <div className="text-3xl">{icon}</div>
      <p className="text-xs font-bold">{title}</p>
    </div>
  );
}

export default Profile;