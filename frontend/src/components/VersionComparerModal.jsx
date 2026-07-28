import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTimes, FaExchangeAlt, FaArrowUp, FaArrowDown, FaChartLine } from "react-icons/fa";
import { getHistory } from "../services/historyService";
import { useAuth } from "../context/AuthContext";

export default function VersionComparerModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [resumeAId, setResumeAId] = useState("");
  const [resumeBId, setResumeBId] = useState("");

  useEffect(() => {
    if (isOpen) {
      getHistory(user?.id).then((data) => {
        if (data) {
          setHistory(data);
          if (data.length >= 2) {
            setResumeAId(data[1].id);
            setResumeBId(data[0].id);
          } else if (data.length === 1) {
            setResumeBId(data[0].id);
          }
        }
      });
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const resumeA = history.find((r) => String(r.id) === String(resumeAId));
  const resumeB = history.find((r) => String(r.id) === String(resumeBId));

  const deltaATS = (resumeB?.ats_score || 0) - (resumeA?.ats_score || 0);
  const deltaMatch = (resumeB?.job_match || 0) - (resumeA?.job_match || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <FaTimes size={18} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xl shadow-lg glow-emerald">
            <FaExchangeAlt />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">A/B Resume Version Comparer</h2>
            <p className="text-xs text-slate-400">Compare 2 resume versions to track score improvements over time</p>
          </div>
        </div>

        {history.length < 1 ? (
          <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800">
            <p className="text-sm font-bold text-slate-300">Minimum 1 Analyzed Resume Required</p>
            <p className="text-xs text-slate-400 mt-1">Analyze your resumes on the Dashboard to unlock A/B comparison metrics.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Select Base Version (Version A)</label>
                <select
                  value={resumeAId}
                  onChange={(e) => setResumeAId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-emerald-500"
                >
                  <option value="">-- Choose First Resume --</option>
                  {history.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.resume_name} ({new Date(h.uploaded_at).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Select New Version (Version B)</label>
                <select
                  value={resumeBId}
                  onChange={(e) => setResumeBId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-emerald-500"
                >
                  <option value="">-- Choose Second Resume --</option>
                  {history.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.resume_name} ({new Date(h.uploaded_at).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {resumeA && resumeB && (
              <div className="space-y-6 pt-4 border-t border-slate-800">
                {/* Improvement Badge Banner */}
                <div className={`p-4 rounded-2xl border text-center flex items-center justify-center gap-3 ${deltaATS >= 0 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'}`}>
                  <FaChartLine className="text-xl" />
                  <span className="text-sm font-black">
                    {deltaATS >= 0 ? `+${deltaATS}% Score Improvement from Version A to B!` : `${deltaATS}% Score Reduction`}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Version A Card */}
                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 text-[10px] font-bold uppercase">Version A</span>
                    <h4 className="text-sm font-bold text-white truncate">{resumeA.resume_name}</h4>
                    <div className="flex justify-between text-xs pt-2">
                      <span className="text-slate-400">ATS Score:</span>
                      <span className="font-extrabold text-cyan-400">{resumeA.ats_score}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Job Match:</span>
                      <span className="font-extrabold text-purple-400">{resumeA.job_match}%</span>
                    </div>
                  </div>

                  {/* Version B Card */}
                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/40 space-y-3 shadow-lg glow-emerald">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">Version B (Latest)</span>
                    <h4 className="text-sm font-bold text-white truncate">{resumeB.resume_name}</h4>
                    <div className="flex justify-between text-xs pt-2">
                      <span className="text-slate-400">ATS Score:</span>
                      <span className="font-extrabold text-emerald-400 flex items-center gap-1">
                        {resumeB.ats_score}% {deltaATS >= 0 ? <FaArrowUp className="text-emerald-400" /> : <FaArrowDown className="text-rose-400" />}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Job Match:</span>
                      <span className="font-extrabold text-emerald-400 flex items-center gap-1">
                        {resumeB.job_match}% {deltaMatch >= 0 ? <FaArrowUp className="text-emerald-400" /> : <FaArrowDown className="text-rose-400" />}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
