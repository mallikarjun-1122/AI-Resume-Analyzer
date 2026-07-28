import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaRobot,
  FaEye,
  FaEyeSlash,
  FaGoogle,
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

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Login Successful!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex">
      {/* LEFT SIDE - Hero Section */}
      <div className="hidden lg:flex w-1/2 items-center justify-center relative overflow-hidden">
        {/* Animated Background Glows */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-96 h-96 bg-blue-300 rounded-full blur-[150px] opacity-30 top-10 left-10"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-96 h-96 bg-purple-300 rounded-full blur-[150px] opacity-30 bottom-10 right-10"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-64 h-64 bg-pink-300 rounded-full blur-[150px] opacity-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />

        <div className="relative z-10 max-w-md p-8">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-8">
            
            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AI Resume Analyzer
              </h1>
              <p className="text-gray-600 text-sm">Build smarter resumes with AI</p>
            </div>
          </div>

          <h1 className="text-5xl font-extrabold leading-tight mb-8 text-gray-800">
            
          </h1>

          

          
        </div>
      </div>

      {/* RIGHT SIDE - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-10 shadow-2xl shadow-blue-500/10"
        >
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
            Welcome Back 👋
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Login to continue your journey
          </p>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="relative">
              <FaEnvelope className="absolute top-4 left-4 text-gray-400" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3.5 pl-12 pr-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>

            <div className="relative">
              <FaLock className="absolute top-4 left-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3.5 pl-12 pr-12 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
              {showPassword ? (
                <FaEyeSlash
                  className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <FaEye
                  className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                Remember me
              </label>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                Forgot password?
              </a>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </motion.button>

            <button
              type="button"
              onClick={() => {
                loginAsGuest();
                toast.success("Welcome! Entered Guest Demo Mode.");
                navigate("/dashboard");
              }}
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all border border-slate-200"
            >
              🚀 Continue as Guest (Instant Demo)
            </button>
          </form>

          <p className="text-center text-gray-600 mt-8">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
            >
              Register
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;