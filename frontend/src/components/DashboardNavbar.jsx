import { useEffect, useState } from "react";
import {
  FaHome,
  FaHistory,
  FaCog,
  FaSignOutAlt,
  FaUserCircle,
  FaRocket,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function DashboardNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [userName, setUserName] = useState("Candidate");
  const [userInitials, setUserInitials] = useState("C");

  useEffect(() => {
    if (user) {
      const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Candidate";
      setUserName(fullName);

      const initials = fullName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      setUserInitials(initials || "C");
    } else {
      setUserName("Guest Candidate");
      setUserInitials("GC");
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-300 text-xs sm:text-sm ${
      isActive
        ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/20"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 shadow-2xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 h-16 sm:h-20">
        {/* Brand Logo */}
        <NavLink to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-base shadow-lg shadow-cyan-500/20">
            ⚡
          </div>
          <span className="text-xl font-black gradient-text-primary hidden sm:block">
            ResumeAI<span className="text-cyan-400">.io</span>
          </span>
        </NavLink>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
          <NavLink to="/dashboard" className={navClass}>
            <FaHome size={14} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/history" className={navClass}>
            <FaHistory size={14} />
            <span>History</span>
          </NavLink>
        </nav>

        {/* User Info & Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-black text-xs shadow-md">
              {userInitials}
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                {userName}
              </p>
              <p className="text-[10px] text-slate-400 font-medium">Pro Candidate</p>
            </div>
          </button>

          <button
            onClick={() => navigate("/settings")}
            className="hidden sm:flex w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 items-center justify-center text-slate-400 hover:text-white transition-colors"
            title="Settings"
          >
            <FaCog size={14} />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold transition-all"
            title="Log out"
          >
            <FaSignOutAlt size={14} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default DashboardNavbar;