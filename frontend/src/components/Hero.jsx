import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaRocket, FaCheckCircle, FaMagic } from "react-icons/fa";

function Hero() {
  return (
    <section className="relative min-h-screen pt-28 pb-20 flex items-center justify-center bg-slate-950 overflow-hidden">
      {/* Ambient background glowing mesh elements */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none animate-ambient"></div>
      <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] bg-purple-600/20 rounded-full blur-[160px] pointer-events-none animate-ambient" style={{ animationDelay: '4s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25"></div>

      {/* Floating particles */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-10 sm:left-24 text-cyan-400/40 text-4xl hidden sm:block"
      >
        🎯
      </motion.div>
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/3 right-10 sm:right-24 text-purple-400/40 text-4xl hidden sm:block"
      >
        ⚡
      </motion.div>

      {/* Main Container */}
      <div className="text-center max-w-5xl px-4 sm:px-6 relative z-10 space-y-8">
        {/* Top Tagline Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-cyan-500/30 text-xs font-extrabold text-cyan-300 shadow-lg glow-cyan"
        >
          <FaMagic className="text-yellow-400 animate-pulse" />
          <span>Next-Gen Gemini 2.5 Powered ATS Engine</span>
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-[10px] uppercase text-cyan-200">v2.0</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none"
        >
          Optimize Resumes.<br />
          <span className="gradient-text-primary">Beat the ATS.</span>{" "}
          <span className="gradient-text-sunset">Get Hired.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-slate-400 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed"
        >
          Stop getting rejected by automated resume scanners. Log in to upload your resume, match against any job description, unlock instant ATS scores, and receive AI-tailored interview preparation in seconds.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center gap-4 pt-2"
        >
          <Link
            to="/login"
            className="px-8 py-4 rounded-2xl text-base font-black text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 flex items-center justify-center gap-3 glow-cyan group"
          >
            <FaRocket className="group-hover:translate-x-1 transition-transform" />
            <span>Analyze Resume Now</span>
          </Link>

          <Link
            to="/register"
            className="px-8 py-4 rounded-2xl text-base font-bold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>Create Free Account</span>
          </Link>
        </motion.div>

        {/* Stat Highlights Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8"
        >
          <div className="p-5 rounded-2xl glass-panel border border-slate-800/80 text-center">
            <div className="text-3xl font-black gradient-text-primary">98.4%</div>
            <div className="text-xs font-semibold text-slate-400 mt-1">ATS Pass Rate</div>
          </div>
          <div className="p-5 rounded-2xl glass-panel border border-slate-800/80 text-center">
            <div className="text-3xl font-black gradient-text-emerald">&lt; 3 Sec</div>
            <div className="text-xs font-semibold text-slate-400 mt-1">AI Scan Speed</div>
          </div>
          <div className="p-5 rounded-2xl glass-panel border border-slate-800/80 text-center">
            <div className="text-3xl font-black gradient-text-sunset">50K+</div>
            <div className="text-xs font-semibold text-slate-400 mt-1">Resumes Analyzed</div>
          </div>
          <div className="p-5 rounded-2xl glass-panel border border-slate-800/80 text-center">
            <div className="text-3xl font-black gradient-text-gold">4.9 / 5</div>
            <div className="text-xs font-semibold text-slate-400 mt-1">Candidate Rating</div>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center items-center gap-6 text-xs text-slate-400 font-semibold pt-4"
        >
          <span className="flex items-center gap-2 text-emerald-400">
            <FaCheckCircle /> 100% Free & Confidential
          </span>
          <span className="flex items-center gap-2 text-cyan-400">
            <FaCheckCircle /> PDF & DOCX Native Support
          </span>
          <span className="flex items-center gap-2 text-purple-400">
            <FaCheckCircle /> Gemini AI Powered Review
          </span>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;