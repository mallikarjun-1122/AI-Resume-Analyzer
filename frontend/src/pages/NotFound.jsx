import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHome, FaRocket } from "react-icons/fa";

function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-10 text-center shadow-2xl relative z-10"
      >
        <div className="text-7xl font-black text-green-400 mb-2 tracking-tight">
          404
        </div>
        <h1 className="text-2xl font-black text-white mb-2">Page Not Found</h1>
        <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
          The page you are looking for might have been moved, renamed, or does not exist.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-400 hover:bg-green-300 text-black text-sm font-black shadow-lg shadow-green-400/20 transition-all"
          >
            <FaRocket /> Go to Dashboard
          </Link>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-sm font-bold border border-zinc-800 hover:border-zinc-700 transition-all"
          >
            <FaHome /> Go to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default NotFound;