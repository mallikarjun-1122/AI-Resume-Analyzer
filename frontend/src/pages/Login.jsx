import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserCheck,
  FaArrowRight
} from "react-icons/fa";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loginUserSession, loginAsGuest } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const result = await loginUser({
        email: trimmedEmail,
        password,
      });

      if (!result.success) {
        if (result.code === "USER_NOT_FOUND") {
          toast.error("No account found with this email. Redirecting you to Sign Up to create your account...", {
            duration: 3500,
          });
          setTimeout(() => {
            navigate(`/register?email=${encodeURIComponent(trimmedEmail)}`);
          }, 1000);
          return;
        }

        if (result.code === "INVALID_PASSWORD") {
          toast.error("Incorrect password. Please verify your credentials and try again.");
          return;
        }

        toast.error(result.message || "Login failed. Please check your credentials.");
        return;
      }

      // Successful login
      loginUserSession(result.user);
      toast.success(`Welcome back, ${result.user.fullName || "Candidate"}!`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const guestEmail = "candidate@analyzer.ai";
    const guestName = "Demo Candidate";
    loginAsGuest({ email: guestEmail, full_name: guestName });
    toast.success("Entered as Demo Candidate");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-green-400/10 rounded-full blur-[160px] animate-ambient"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-emerald-400/10 rounded-full blur-[160px] animate-ambient" style={{ animationDelay: '5s' }}></div>
      </div>

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-zinc-950 p-8 sm:p-10 rounded-3xl border border-zinc-800 shadow-2xl relative z-10 space-y-6"
      >
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex w-14 h-14 mx-auto rounded-2xl bg-zinc-900 border border-green-400/30 items-center justify-center text-green-300 text-2xl shadow-lg shadow-green-400/10 hover:border-green-400 transition-colors">
            ⚡
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Welcome Back</h1>
          <p className="text-zinc-400 text-xs sm:text-sm">Sign in to access your ATS Resume Analyzer</p>
        </div>

        {/* Login Form */}
        <form className="space-y-4" onSubmit={handleLogin}>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-green-400 hover:bg-green-300 text-black font-black text-sm shadow-xl shadow-green-400/20 hover:shadow-green-400/35 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Signing in..." : (
              <>
                <span>Sign In</span>
                <FaArrowRight size={13} />
              </>
            )}
          </button>
        </form>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-zinc-800 w-full"></div>
          <span className="bg-zinc-950 px-3 text-xs text-zinc-500 uppercase tracking-widest font-semibold">Or</span>
          <div className="border-t border-zinc-800 w-full"></div>
        </div>

        {/* Guest / Demo Option */}
        <button
          type="button"
          onClick={handleGuestLogin}
          className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
        >
          <FaUserCheck className="text-green-400" />
          <span>Continue as Guest Candidate</span>
        </button>

        <p className="text-center text-xs text-zinc-400 pt-2">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-400 font-bold hover:underline">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;