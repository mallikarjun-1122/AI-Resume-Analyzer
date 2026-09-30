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
          <h1 className="text-3xl font-black text-white tracking-tight">⚙ Settings & Preferences</h1>
          <p className="text-zinc-400 text-sm">Manage theme, security options, and notifications</p>
        </div>

        {/* Appearance */}
        <div className="bg-zinc-950 p-8 rounded-3xl border border-zinc-800 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-green-400/30 text-green-300 flex items-center justify-center">
              <FaMoon />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Theme & Appearance</h2>
              <p className="text-xs text-zinc-400">Select your preferred color scheme</p>
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
                  ? "bg-zinc-900 border-green-400 text-green-300 shadow-lg shadow-green-400/10"
                  : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white"
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
                  ? "bg-zinc-900 border-green-400 text-green-300 shadow-lg shadow-green-400/10"
                  : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white"
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
                  ? "bg-zinc-900 border-green-400 text-green-300 shadow-lg shadow-green-400/10"
                  : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              <FaDesktop className="text-2xl mx-auto" />
              <p className="text-xs font-bold">System Default</p>
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-zinc-950 p-8 rounded-3xl border border-zinc-800 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-green-400/30 text-green-300 flex items-center justify-center">
              <FaBell />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Notifications</h2>
              <p className="text-xs text-zinc-400">Configure alert preferences</p>
            </div>
          </div>

          <div className="space-y-4 divide-y divide-zinc-800/60">
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
        <div className="bg-zinc-950 p-8 rounded-3xl border border-zinc-800 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-green-400/30 text-green-300 flex items-center justify-center">
              <FaShieldAlt />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Account Security</h2>
              <p className="text-xs text-zinc-400">Update credentials and access control</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-300">Change Password</label>
              <input
                type="password"
                placeholder="New Password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm outline-none focus:border-green-400 transition-colors"
              />
              <button
                onClick={updatePassword}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-zinc-200 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-all"
              >
                Update Password
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-300">Change Email</label>
              <input
                type="email"
                placeholder="New Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm outline-none focus:border-green-400 transition-colors"
              />
              <button
                onClick={updateEmail}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-zinc-200 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-all"
              >
                Update Email
              </button>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-zinc-950 p-8 rounded-3xl border border-zinc-800 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-green-400/30 text-green-300 flex items-center justify-center">
                <FaUserCog />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">Active Session</h2>
                <p className="text-xs text-zinc-400">Current login details</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 text-xs font-bold flex items-center gap-2 transition-all"
            >
              <FaSignOutAlt /> Sign Out
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex justify-between items-center text-xs">
            <span className="text-zinc-400">User Session Identifier:</span>
            <div className="flex items-center gap-2 text-zinc-200 font-mono">
              <span>{user?.id ? `${user.id.substring(0, 16)}...` : "demo-user-123"}</span>
              <button onClick={copyId} className="hover:text-green-400 transition-colors"><FaCopy /></button>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-zinc-950 p-8 rounded-3xl border border-zinc-800 shadow-2xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-green-400/30 text-green-300 flex items-center justify-center">
              <FaInfoCircle />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">System Architecture</h2>
              <p className="text-xs text-zinc-400">AI Resume Analyzer Engine Details</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
              <p className="text-zinc-500 font-bold">Engine</p>
              <p className="text-zinc-200 font-semibold mt-1">Gemini 2.5 AI</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
              <p className="text-zinc-500 font-bold">Backend</p>
              <p className="text-zinc-200 font-semibold mt-1">FastAPI Python</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
              <p className="text-zinc-500 font-bold">Frontend</p>
              <p className="text-zinc-200 font-semibold mt-1">React + Vite</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
              <p className="text-zinc-500 font-bold">Status</p>
              <p className="text-green-400 font-bold mt-1">Operational ⚡</p>
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
        <p className="text-zinc-400 text-xs">{subtitle}</p>
      </div>
      <Switch
        checked={checked}
        onChange={onChange}
        onColor="#4ade80"
        uncheckedIcon={false}
        checkedIcon={false}
      />
    </div>
  );
}

export default Settings;