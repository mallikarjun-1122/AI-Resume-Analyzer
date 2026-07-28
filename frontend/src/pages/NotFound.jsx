import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHome, FaRocket } from "react-icons/fa";

function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-10 text-center shadow-2xl relative z-10"
      >
        <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 mb-2">
          404
        </div>
        <h1 className="text-2xl font-extrabold text-white mb-2">Page Not Found</h1>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          The page you are looking for might have been moved, renamed, or does not exist.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-bold shadow-lg shadow-blue-500/25 transition-all"
          >
            <FaRocket /> Go to Dashboard
          </Link>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition-all"
          >
            <FaHome /> Go to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default NotFound;