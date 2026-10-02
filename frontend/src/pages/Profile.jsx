import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { getHistory } from "../services/historyService";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  FaEnvelope,
  FaIdBadge,
  FaCalendarAlt,
  FaAward,
  FaChartLine,
  FaFileAlt,
  FaBullseye,
  FaUserEdit,
  FaSave,
} from "react-icons/fa";

function Profile() {
  const { user, loginAsGuest } = useAuth();

  const [stats, setStats] = useState({
    total: 0,
    avgATS: 0,
    highestATS: 0,
    avgMatch: 0,
  });

  const [displayName, setDisplayName] = useState("Mallikarjun");
  const [displayEmail, setDisplayEmail] = useState("mallikarjun@analyzer.ai");

  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedName =
      localStorage.getItem("candidate_name") ||
      user?.user_metadata?.full_name ||
      "Mallikarjun";

    const savedEmail =
      localStorage.getItem("candidate_email") ||
      user?.email ||
      "mallikarjun@analyzer.ai";

    setDisplayName(savedName);
    setDisplayEmail(savedEmail);
    setEditName(savedName);
    setEditEmail(savedEmail);

    if (user) {
      loadStats();
    }
  }, [user]);

  async function loadStats() {
    try {
      const userKey = user?.email || user?.id || localStorage.getItem("candidate_email") || localStorage.getItem("candidate_id");
      const history = await getHistory(userKey);
      if (!history || history.length === 0) {
        setStats({ total: 0, avgATS: 0, highestATS: 0, avgMatch: 0 });
        return;
      }

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

      setStats({ total, avgATS, highestATS, avgMatch });
    } catch (err) {
      console.error(err);
      setStats({ total: 0, avgATS: 0, highestATS: 0, avgMatch: 0 });
    }
  }

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error("Please enter a valid candidate name.");
      return;
    }
    if (!editEmail.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const newName = editName.trim();
    const newEmail = editEmail.trim();

    localStorage.setItem("candidate_name", newName);
    localStorage.setItem("candidate_email", newEmail);

    setDisplayName(newName);
    setDisplayEmail(newEmail);
    setIsEditing(false);

    if (loginAsGuest) {
      loginAsGuest({
        email: newEmail,
        full_name: newName,
      });
    }

    toast.success("Profile Details Updated Successfully! ✨");
  };

  const getInitials = (name) => {
    if (!name) return "M";
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
          className="bg-zinc-950 p-8 sm:p-10 rounded-3xl border border-zinc-800 shadow-2xl relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-28 h-28 rounded-3xl bg-zinc-900 border border-green-400/40 flex items-center justify-center text-green-300 text-4xl font-black shadow-xl shadow-green-400/10">
              {getInitials(displayName)}
            </div>

            <div className="text-center sm:text-left space-y-1 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-3xl font-black text-white tracking-tight">{displayName}</h1>
                <span className="px-3 py-1 rounded-full bg-green-400/10 text-green-300 border border-green-400/30 text-xs font-bold uppercase tracking-wider">
                  Candidate Profile
                </span>
              </div>
              <p className="text-zinc-400 text-sm font-medium">{displayEmail}</p>
              <p className="text-zinc-500 text-xs pt-1">
                Account Status: Active • Gemini 2.5 Enabled
              </p>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-800 hover:border-green-400/40 text-xs font-bold transition-all flex items-center gap-2"
            >
              <FaUserEdit size={14} className="text-green-400" />
              <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
            </button>
          </div>

          {/* Edit Name & Email Form */}
          {isEditing && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              onSubmit={handleSaveProfile}
              className="mt-6 pt-6 border-t border-zinc-800 space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-400 mb-1.5 block">Candidate Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter candidate full name..."
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm outline-none focus:border-green-400 transition-colors placeholder-zinc-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 mb-1.5 block">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter candidate email..."
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm outline-none focus:border-green-400 transition-colors placeholder-zinc-500"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-green-400 hover:bg-green-300 text-black font-black text-xs shadow-lg shadow-green-400/20 flex items-center justify-center gap-2 transition-all"
                >
                  <FaSave /> Save Profile Details
                </button>
              </div>
            </motion.form>
          )}
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
          />
          <StatCard
            icon={<FaChartLine />}
            title="Average ATS Score"
            value={`${stats.avgATS}%`}
            isGreen
          />
          <StatCard
            icon={<FaAward />}
            title="Highest ATS Score"
            value={`${stats.highestATS}%`}
            isGreen
          />
          <StatCard
            icon={<FaBullseye />}
            title="Average Job Match"
            value={`${stats.avgMatch}%`}
          />
        </motion.div>

        {/* Info Rows */}
        <motion.div
          variants={itemVariants}
          className="bg-zinc-950 p-8 rounded-3xl border border-zinc-800 shadow-2xl space-y-6"
        >
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <span>📋</span> Candidate Details
          </h2>

          <div className="space-y-3">
            <InfoRow
              icon={<FaUserEdit className="text-green-400" />}
              title="Full Name"
              value={displayName}
            />
            <InfoRow
              icon={<FaEnvelope className="text-green-400" />}
              title="Email Address"
              value={displayEmail}
            />
            <InfoRow
              icon={<FaIdBadge className="text-green-400" />}
              title="Candidate ID"
              value={user?.id || "demo-user-123"}
            />
            <InfoRow
              icon={<FaCalendarAlt className="text-green-400" />}
              title="Account Type"
              value="Candidate Access"
            />
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          variants={itemVariants}
          className="bg-zinc-950 p-8 rounded-3xl border border-zinc-800 shadow-2xl space-y-6"
        >
          <h2 className="text-xl font-black text-white flex items-center gap-2">
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

function StatCard({ icon, title, value, isGreen }) {
  return (
    <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 text-center space-y-2 shadow-xl hover:border-zinc-700 transition-all">
      <div className="w-10 h-10 mx-auto rounded-xl bg-zinc-900 border border-green-400/30 text-green-400 flex items-center justify-center text-lg shadow-sm">
        {icon}
      </div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{title}</p>
      <p className={`text-3xl font-black ${isGreen ? "text-green-400" : "text-white"}`}>{value}</p>
    </div>
  );
}

function InfoRow({ icon, title, value }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
      <div className="text-xl">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-zinc-400">{title}</p>
        <p className="text-sm font-semibold text-zinc-100 truncate">{value}</p>
      </div>
    </div>
  );
}

function Badge({ title, active, icon }) {
  return (
    <div
      className={`p-5 rounded-2xl text-center space-y-2 border transition-all ${
        active
          ? "bg-zinc-900 border-green-400/40 text-white shadow-lg shadow-green-400/10"
          : "bg-zinc-900/40 border-zinc-800 text-zinc-500"
      }`}
    >
      <div className="text-3xl">{icon}</div>
      <p className="text-xs font-bold">{title}</p>
    </div>
  );
}

export default Profile;