import { Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !password) {
      toast.error("Please fill all fields.");
      return;
    }

    if (!acceptedTerms) {
      toast.error("Please accept the terms and conditions.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(
      "Registration successful! Please check your email to verify your account."
    );

    setFullName("");
    setEmail("");
    setPassword("");
    setAcceptedTerms(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex">
      {/* LEFT PANEL - Hero Section */}
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
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-[150px] opacity-30 top-10 left-10"
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
          className="absolute w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-[150px] opacity-30 bottom-10 right-10"
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
          className="absolute w-64 h-64 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full blur-[150px] opacity-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />

        <div className="relative z-10 max-w-md p-8">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-8"
          >
            
            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Resume Analyzer
              </h1>
              <p className="text-gray-600 text-sm">Create your future with AI</p>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl font-extrabold leading-tight mb-8 text-gray-800"
          >
            Start Your <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Career Journey
            </span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-xl border border-purple-200/50 hover:border-purple-300 transition-all">
              <span className="text-2xl">🚀</span>
              <span className="font-medium text-gray-700">AI Resume Analysis</span>
            </div>
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-xl border border-blue-200/50 hover:border-blue-300 transition-all">
              <span className="text-2xl">📈</span>
              <span className="font-medium text-gray-700">ATS Optimization</span>
            </div>
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-xl border border-purple-200/50 hover:border-purple-300 transition-all">
              <span className="text-2xl">💡</span>
              <span className="font-medium text-gray-700">Resume Suggestions</span>
            </div>
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-xl border border-pink-200/50 hover:border-pink-300 transition-all">
              <span className="text-2xl">🎯</span>
              <span className="font-medium text-gray-700">Interview Preparation</span>
            </div>
            
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex items-center gap-4"
          >
            
          </motion.div>
        </div>
      </div>

      {/* RIGHT PANEL - Registration Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-10 shadow-2xl shadow-purple-500/10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Create Account
            </h2>
            <p className="text-center text-gray-500 mb-8">
              Join AI Resume Analyzer and transform your career
            </p>
          </motion.div>

          <form className="space-y-5" onSubmit={handleRegister}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <FaUser className="absolute top-4 left-4 text-purple-400" />
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full py-3.5 pl-12 pr-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <FaEnvelope className="absolute top-4 left-4 text-blue-400" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3.5 pl-12 pr-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <FaLock className="absolute top-4 left-4 text-pink-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3.5 pl-12 pr-12 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
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
            </motion.div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-gray-600 cursor-pointer">
                I agree to the <span className="text-purple-600 font-medium hover:underline">Terms of Service</span> & <span className="text-purple-600 font-medium hover:underline">Privacy Policy</span>
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white font-semibold text-base shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                <>
                  Create Account
                  <FaArrowRight size={16} />
                </>
              )}
            </motion.button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              
            </div>

            
          </form>

          <p className="text-center text-gray-600 mt-8">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-colors"
            >
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;