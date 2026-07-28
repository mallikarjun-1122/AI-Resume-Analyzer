import { useState } from "react";
import { motion } from "framer-motion";
import { FaMagic, FaTimes, FaCopy, FaCheck, FaSpinner, FaRocket } from "react-icons/fa";
import { enhanceBulletPoint } from "../services/analyzeService";
import toast from "react-hot-toast";

export default function BulletEnhancerModal({ isOpen, onClose }) {
  const [originalBullet, setOriginalBullet] = useState("");
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!isOpen) return null;

  const handleEnhance = async (e) => {
    e.preventDefault();
    if (!originalBullet.trim()) {
      toast.error("Please enter a bullet point to enhance.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("bullet_point", originalBullet);
      formData.append("target_role", targetRole);

      const res = await enhanceBulletPoint(formData);
      if (res.success && res.enhanced_bullets) {
        setResults(res.enhanced_bullets);
        toast.success("AI Enhanced 3 STAR Bullet Options!");
      } else {
        toast.error("Enhancement failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error connecting to AI Bullet Enhancer.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Copied bullet point to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <FaTimes size={18} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xl shadow-lg glow-amber">
            <FaMagic />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">AI Bullet Enhancer (STAR Method)</h2>
            <p className="text-xs text-slate-400">Rewrite weak bullet points into metric-driven achievements</p>
          </div>
        </div>

        <form onSubmit={handleEnhance} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Target Job Title</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm outline-none focus:border-amber-500"
              placeholder="e.g., Senior Full Stack Developer"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Original Bullet Point</label>
            <textarea
              rows={3}
              value={originalBullet}
              onChange={(e) => setOriginalBullet(e.target.value)}
              placeholder="e.g. Worked on a React application for client tasks..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 hover:from-amber-400 hover:to-red-500 text-white font-extrabold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaMagic />}
            <span>{loading ? "Rewriting with AI..." : "Enhance Bullet Point (STAR Method)"}</span>
          </button>
        </form>

        {results.length > 0 && (
          <div className="mt-8 space-y-4 pt-6 border-t border-slate-800">
            <h3 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider">
              ✨ AI Enhanced STAR Options
            </h3>

            <div className="space-y-3">
              {results.map((bullet, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all space-y-2 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                      • {bullet}
                    </p>
                    <button
                      onClick={() => copyToClipboard(bullet, idx)}
                      className="p-2 rounded-xl bg-slate-800 text-amber-400 hover:bg-amber-500 hover:text-white transition-all flex-shrink-0"
                      title="Copy option"
                    >
                      {copiedIndex === idx ? <FaCheck size={14} /> : <FaCopy size={14} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
