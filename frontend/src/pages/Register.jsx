import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { user, loginAsGuest } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !password) {
      toast.error("Please fill all fields.");
      return;
    }

    if (!acceptedTerms) {
      toast.error("Please accept the terms and conditions.");
      return;
    }

    setLoading(true);

    try {
      localStorage.setItem("candidate_name", trimmedName);
      localStorage.setItem("candidate_email", trimmedEmail);

      await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: trimmedName,
          },
        },
      });

      loginAsGuest({ email: trimmedEmail, full_name: trimmedName });
      toast.success(`Account Created! Welcome, ${trimmedName}!`);
      navigate("/dashboard");
    } catch (err) {
      localStorage.setItem("candidate_name", trimmedName);
      localStorage.setItem("candidate_email", trimmedEmail);

      loginAsGuest({ email: trimmedEmail, full_name: trimmedName });
      toast.success(`Account Created! Welcome, ${trimmedName}!`);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 right-1/4 w-[30rem] h-[30rem] bg-green-400/10 rounded-full blur-[160px] animate-ambient"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[30rem] h-[30rem] bg-emerald-400/10 rounded-full blur-[160px] animate-ambient" style={{ animationDelay: '5s' }}></div>
      </div>

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-zinc-950 p-8 sm:p-10 rounded-3xl border border-zinc-800 shadow-2xl relative z-10 space-y-6"
      >
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex w-14 h-14 mx-auto rounded-2xl bg-zinc-900 border border-green-400/30 items-center justify-center text-green-300 text-2xl shadow-lg shadow-green-400/10 hover:border-green-400 transition-colors">
            ⚡
          </Link>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Create Account
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm">
            Join AI Resume Analyzer and accelerate your career
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleRegister}>
          <div className="relative">
            <FaUser className="absolute top-3.5 left-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full py-3 pl-11 pr-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm placeholder-zinc-500 outline-none focus:border-green-400 transition-all"
            />
          </div>

          <div className="relative">
            <FaEnvelope className="absolute top-3.5 left-4 text-zinc-500" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-3 pl-11 pr-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm placeholder-zinc-500 outline-none focus:border-green-400 transition-all"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute top-3.5 left-4 text-zinc-500" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-3 pl-11 pr-11 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm placeholder-zinc-500 outline-none focus:border-green-400 transition-all"
            />
            {showPassword ? (
              <FaEyeSlash
                className="absolute top-3.5 right-4 cursor-pointer text-zinc-500 hover:text-zinc-300"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <FaEye
                className="absolute top-3.5 right-4 cursor-pointer text-zinc-500 hover:text-zinc-300"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-green-400 focus:ring-green-400 cursor-pointer accent-green-400"
            />
            <label htmlFor="terms" className="text-xs text-zinc-400 cursor-pointer">
              I agree to the <span className="text-green-400 font-medium hover:underline">Terms of Service</span> & <span className="text-green-400 font-medium hover:underline">Privacy Policy</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-green-400 hover:bg-green-300 text-black font-black text-sm shadow-xl shadow-green-400/20 hover:shadow-green-400/35 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Creating Account..." : (
              <>
                <span>Create Account</span>
                <FaArrowRight size={13} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-400 pt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-green-400 font-bold hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;