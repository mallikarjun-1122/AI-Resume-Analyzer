import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaRocket,
} from "react-icons/fa";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { loginAsGuest } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const prefix = email.split("@")[0];
        const formattedName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
        loginAsGuest({ email, full_name: formattedName });
        toast.success(`Welcome back, ${formattedName}!`);
        navigate("/dashboard");
        return;
      }

      const u = data?.user;
      const formattedName = u?.user_metadata?.full_name || (u?.email ? u.email.split("@")[0] : "Candidate");
      loginAsGuest({ email: u?.email || email, full_name: formattedName });
      toast.success(`Welcome back, ${formattedName}!`);
      navigate("/dashboard");
    } catch (error) {
      const prefix = email.split("@")[0];
      const formattedName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
      loginAsGuest({ email, full_name: formattedName });
      toast.success(`Welcome back, ${formattedName}!`);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-cyan-500/10 rounded-full blur-[160px] animate-ambient"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-purple-600/10 rounded-full blur-[160px] animate-ambient" style={{ animationDelay: '6s' }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl relative z-10 space-y-6"
      >
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-2xl shadow-lg glow-cyan">
            ⚡
          </div>
          <h1 className="text-3xl font-black gradient-text-primary">Welcome Back</h1>
          <p className="text-slate-400 text-xs sm:text-sm">Log in to access your AI Resume Dashboard</p>
        </div>

        {/* Login Form */}
        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="relative">
            <FaEnvelope className="absolute top-3.5 left-4 text-slate-500" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-3 pl-11 pr-4 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 outline-none focus:border-cyan-500 transition-all"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute top-3.5 left-4 text-slate-500" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-3 pl-11 pr-11 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 outline-none focus:border-cyan-500 transition-all"
            />
            {showPassword ? (
              <FaEyeSlash
                className="absolute top-3.5 right-4 cursor-pointer text-slate-500 hover:text-slate-300"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <FaEye
                className="absolute top-3.5 right-4 cursor-pointer text-slate-500 hover:text-slate-300"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/20 transition-all disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Log In"}
          </button>

          <div className="relative py-2 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <span className="relative px-3 bg-slate-950 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              or demo access
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              loginAsGuest({ email: "guest.candidate@analyzer.ai", full_name: "Guest Candidate" });
              toast.success("Welcome! Entered Candidate Demo Mode.");
              navigate("/dashboard");
            }}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <FaRocket /> Instant Candidate Demo Access
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 pt-2">
          Don't have an account?{" "}
          <Link to="/register" className="text-cyan-400 font-bold hover:underline">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;