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
      toast.error(err.response?.data?.error || err.message || "Error connecting to AI Bullet Enhancer.");
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
        className="w-full max-w-2xl bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-zinc-800 shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white transition-colors border border-zinc-800"
        >
          <FaTimes size={16} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-green-400/30 flex items-center justify-center text-green-300 text-xl shadow-lg shadow-green-400/10">
            <FaMagic />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">AI Bullet Enhancer (STAR Method)</h2>
            <p className="text-xs text-zinc-400">Rewrite weak bullet points into metric-driven achievements</p>
          </div>
        </div>

        <form onSubmit={handleEnhance} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">Target Job Title</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm outline-none focus:border-green-400 transition-colors placeholder-zinc-500"
              placeholder="e.g., Senior Full Stack Developer"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">Original Bullet Point</label>
            <textarea
              rows={3}
              value={originalBullet}
              onChange={(e) => setOriginalBullet(e.target.value)}
              placeholder="e.g. Worked on a React application for client tasks..."
              className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm outline-none focus:border-green-400 transition-colors resize-none placeholder-zinc-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-green-400 hover:bg-green-300 text-black font-black text-sm shadow-xl shadow-green-400/20 hover:shadow-green-400/35 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaMagic />}
            <span>{loading ? "Rewriting with AI..." : "Enhance Bullet Point (STAR Method)"}</span>
          </button>
        </form>

        {results.length > 0 && (
          <div className="mt-8 space-y-4 pt-6 border-t border-zinc-800">
            <h3 className="text-xs font-black text-green-400 uppercase tracking-wider">
              ✨ AI Enhanced STAR Options
            </h3>

            <div className="space-y-3">
              {results.map((bullet, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-green-400/40 transition-all space-y-2 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium">
                      • {bullet}
                    </p>
                    <button
                      onClick={() => copyToClipboard(bullet, idx)}
                      className="p-2 rounded-xl bg-zinc-800 text-green-400 hover:bg-green-400 hover:text-black transition-all flex-shrink-0"
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
