import { useEffect, useState } from "react";
import {
  FaHome,
  FaHistory,
  FaCog,
  FaSignOutAlt,
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
        ? "bg-green-400 text-black shadow-lg shadow-green-400/20"
        : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-black/85 backdrop-blur-xl border-b border-zinc-800 shadow-2xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 h-16 sm:h-20">
        {/* Brand Logo */}
        <NavLink to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-green-400/30 flex items-center justify-center text-green-300 font-extrabold text-base shadow-lg shadow-green-400/10">
            ⚡
          </div>
          <span className="text-xl font-black text-white hidden sm:block">
            ResumeAI<span className="text-green-400">.io</span>
          </span>
        </NavLink>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1.5 bg-zinc-900/80 p-1.5 rounded-2xl border border-zinc-800">
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
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-green-400/40 flex items-center justify-center text-green-300 font-black text-xs">
              {userInitials}
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-bold text-zinc-200 group-hover:text-green-300 transition-colors">
                {userName}
              </p>
              <p className="text-[10px] text-zinc-400 font-medium">Candidate</p>
            </div>
          </button>

          <button
            onClick={() => navigate("/settings")}
            className="hidden sm:flex w-9 h-9 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 items-center justify-center text-zinc-400 hover:text-white transition-colors"
            title="Settings"
          >
            <FaCog size={14} />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-bold transition-all hover:border-zinc-700"
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