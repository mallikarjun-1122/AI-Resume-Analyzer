import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
} from "react-icons/fa";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { loginAsGuest } = useAuth();

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

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        if (error.message?.includes("Failed to fetch") || error.message?.includes("FetchError")) {
          loginAsGuest();
          toast.success("Entered Candidate Demo Mode!");
          navigate("/dashboard");
          return;
        }
        toast.error(error.message);
        return;
      }

      toast.success("Registration successful! Check your email or use Guest mode.");
      loginAsGuest();
      navigate("/dashboard");
    } catch (err) {
      if (err.message?.includes("Failed to fetch") || err.name === "TypeError") {
        loginAsGuest();
        toast.success("Entered Candidate Demo Mode!");
        navigate("/dashboard");
      } else {
        toast.error(err.message || "Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 right-1/4 w-[30rem] h-[30rem] bg-purple-500/10 rounded-full blur-[160px] animate-ambient"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[30rem] h-[30rem] bg-cyan-600/10 rounded-full blur-[160px] animate-ambient" style={{ animationDelay: '6s' }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl relative z-10 space-y-6"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black gradient-text-primary">
            Create Account
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Join AI Resume Analyzer and elevate your career
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleRegister}>
          <div className="relative">
            <FaUser className="absolute top-3.5 left-4 text-purple-400" />
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full py-3 pl-11 pr-4 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 outline-none focus:border-purple-500 transition-all"
            />
          </div>

          <div className="relative">
            <FaEnvelope className="absolute top-3.5 left-4 text-cyan-400" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-3 pl-11 pr-4 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 outline-none focus:border-cyan-500 transition-all"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute top-3.5 left-4 text-purple-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-3 pl-11 pr-11 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 outline-none focus:border-purple-500 transition-all"
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

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500 cursor-pointer"
            />
            <label htmlFor="terms" className="text-xs text-slate-400 cursor-pointer">
              I agree to the <span className="text-cyan-400 font-medium hover:underline">Terms of Service</span> & <span className="text-cyan-400 font-medium hover:underline">Privacy Policy</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-sm shadow-xl shadow-purple-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Creating Account..." : (
              <>
                <span>Create Account</span>
                <FaArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 pt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-400 font-bold hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;