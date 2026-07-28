import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useTheme } from "../context/ThemeContext";
import { useSettings } from "../context/SettingsContext";
import Switch from "react-switch";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import {
  FaMoon,
  FaSun,
  FaDesktop,
  FaBell,
  FaShieldAlt,
  FaUserCog,
  FaInfoCircle,
  FaSignOutAlt,
  FaCopy,
} from "react-icons/fa";

function Settings() {
  const { theme, setTheme } = useTheme();
  const { notifications, setNotifications } = useSettings();
  const { user, logout } = useAuth();

  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");

  const updatePassword = async () => {
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated successfully");
      setPassword("");
    } catch (e) {
      toast.error(e.message || "Could not update password");
    }
  };

  const updateEmail = async () => {
    try {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) throw error;
      toast.success("Verification email sent to new address");
    } catch (e) {
      toast.error(e.message || "Could not update email");
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    window.location.href = "/login";
  };

  const copyId = () => {
    navigator.clipboard.writeText(user?.id || "demo-user-123");
    toast.success("User ID copied to clipboard");
  };

  const changeNotification = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black text-white">⚙ Settings & Preferences</h1>
          <p className="text-slate-400 text-sm">Manage theme, security options, and notifications</p>
        </div>

        {/* Appearance */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <FaMoon />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Theme & Appearance</h2>
              <p className="text-xs text-slate-400">Select your preferred color scheme</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <button
              onClick={() => {
                setTheme("dark");
                toast.success("Dark Mode Enabled 🌙");
              }}
              className={`p-5 rounded-2xl border transition-all text-center space-y-2 cursor-pointer ${
                theme === "dark"
                  ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-lg glow-cyan"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <FaMoon className="text-2xl mx-auto" />
              <p className="text-xs font-bold">Dark Mode</p>
            </button>

            <button
              onClick={() => {
                setTheme("light");
                toast.success("Light Mode Enabled ☀️");
              }}
              className={`p-5 rounded-2xl border transition-all text-center space-y-2 cursor-pointer ${
                theme === "light"
                  ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-lg glow-cyan"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <FaSun className="text-2xl mx-auto" />
              <p className="text-xs font-bold">Light Mode</p>
            </button>

            <button
              onClick={() => {
                setTheme("system");
                toast.success("System Theme Enabled 🖥️");
              }}
              className={`p-5 rounded-2xl border transition-all text-center space-y-2 cursor-pointer ${
                theme === "system"
                  ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-lg glow-cyan"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <FaDesktop className="text-2xl mx-auto" />
              <p className="text-xs font-bold">System Default</p>
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <FaBell />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Notifications</h2>
              <p className="text-xs text-slate-400">Configure alert preferences</p>
            </div>
          </div>

          <div className="space-y-4 divide-y divide-slate-800/60">
            <NotificationRow
              title="Resume Analysis Completed"
              subtitle="Get notified when AI processing completes."
              checked={notifications.analysis}
              onChange={() => changeNotification("analysis")}
            />
            <NotificationRow
              title="ATS Optimization Tips"
              subtitle="Receive weekly suggestions to boost score."
              checked={notifications.tips}
              onChange={() => changeNotification("tips")}
            />
            <NotificationRow
              title="Feature Announcements"
              subtitle="Stay updated on new Gemini models and tools."
              checked={notifications.updates}
              onChange={() => changeNotification("updates")}
            />
          </div>
        </div>

        {/* Security */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <FaShieldAlt />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Account Security</h2>
              <p className="text-xs text-slate-400">Update credentials and access control</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300">Change Password</label>
              <input
                type="password"
                placeholder="New Password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm outline-none focus:border-cyan-500"
              />
              <button
                onClick={updatePassword}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-all"
              >
                Update Password
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300">Change Email</label>
              <input
                type="email"
                placeholder="New Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm outline-none focus:border-cyan-500"
              />
              <button
                onClick={updateEmail}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-all"
              >
                Update Email
              </button>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                <FaUserCog />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-white">Active Session</h2>
                <p className="text-xs text-slate-400">Current login details</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold flex items-center gap-2"
            >
              <FaSignOutAlt /> Sign Out
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">User Session Identifier:</span>
            <div className="flex items-center gap-2 text-slate-200 font-mono">
              <span>{user?.id ? `${user.id.substring(0, 16)}...` : "demo-user-123"}</span>
              <button onClick={copyId} className="hover:text-cyan-400"><FaCopy /></button>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <FaInfoCircle />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">System Architecture</h2>
              <p className="text-xs text-slate-400">AI Resume Analyzer Engine Details</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <p className="text-slate-500 font-bold">Engine</p>
              <p className="text-slate-200 font-semibold mt-1">Gemini 2.5 AI</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <p className="text-slate-500 font-bold">Backend</p>
              <p className="text-slate-200 font-semibold mt-1">FastAPI Python</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <p className="text-slate-500 font-bold">Frontend</p>
              <p className="text-slate-200 font-semibold mt-1">React + Vite</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <p className="text-slate-500 font-bold">Status</p>
              <p className="text-emerald-400 font-semibold mt-1">Operational 🚀</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function NotificationRow({ title, subtitle, checked, onChange }) {
  return (
    <div className="flex justify-between items-center py-3">
      <div>
        <h3 className="text-sm font-bold text-white">{title}</h3>
        <p className="text-slate-400 text-xs">{subtitle}</p>
      </div>
      <Switch
        checked={checked}
        onChange={onChange}
        onColor="#06b6d4"
        uncheckedIcon={false}
        checkedIcon={false}
      />
    </div>
  );
}

export default Settings;