import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaRocket, FaCheckCircle, FaMagic } from "react-icons/fa";

function Hero() {
  return (
    <section className="relative min-h-screen pt-28 pb-20 flex items-center justify-center bg-black overflow-hidden">
      {/* Subtle ambient light green glow */}
      <div className="absolute top-12 left-10 w-96 h-96 bg-green-400/10 rounded-full blur-[160px] pointer-events-none animate-ambient"></div>
      <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] bg-emerald-400/10 rounded-full blur-[180px] pointer-events-none animate-ambient" style={{ animationDelay: '5s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35"></div>

      {/* Main Container */}
      <div className="text-center max-w-5xl px-4 sm:px-6 relative z-10 space-y-8">
        {/* Top Tagline Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-950 border border-green-400/30 text-xs font-extrabold text-green-300 shadow-lg shadow-green-400/10"
        >
          <FaMagic className="text-green-400 animate-pulse" />
          <span>Explainable Rule-Based ATS + Gemini 2.5 Feedback</span>
          <span className="px-2 py-0.5 rounded-full bg-green-400/20 text-[10px] uppercase text-green-300">v2.0</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none text-white"
        >
          Optimize Resumes.<br />
          <span className="text-green-400">Beat the ATS.</span>{" "}
          <span className="text-zinc-200">Get Hired.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-zinc-400 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed"
        >
          Stop getting rejected by automated resume scanners. Upload your resume, match against any job description, unlock transparent ATS scores, and receive AI-tailored career feedback in seconds.
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
            className="px-8 py-4 rounded-2xl text-base font-black text-black bg-green-400 hover:bg-green-300 shadow-xl shadow-green-400/20 hover:shadow-green-400/35 transition-all duration-300 flex items-center justify-center gap-3 group"
          >
            <FaRocket className="group-hover:translate-x-1 transition-transform text-black" />
            <span>Analyze Resume Now</span>
          </Link>

          <Link
            to="/register"
            className="px-8 py-4 rounded-2xl text-base font-bold text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>Create Free Account</span>
          </Link>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center items-center gap-6 text-xs text-zinc-400 font-semibold pt-6"
        >
          <span className="flex items-center gap-2 text-green-300">
            <FaCheckCircle className="text-green-400" /> 100% Free & Confidential
          </span>
          <span className="flex items-center gap-2 text-zinc-300">
            <FaCheckCircle className="text-green-400" /> PDF & DOCX Native Support
          </span>
          <span className="flex items-center gap-2 text-zinc-300">
            <FaCheckCircle className="text-green-400" /> Gemini AI Powered Review
          </span>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;