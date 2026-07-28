import { useState } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaUpload, FaTrophy, FaSpinner, FaFilePdf, FaFileWord, FaCheckCircle } from "react-icons/fa";
import { batchAnalyzeResumes } from "../services/analyzeService";
import toast from "react-hot-toast";

export default function RecruiterBatchSection() {
  const [files, setFiles] = useState([]);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  const handleFilesChange = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length === 0) return;
    setFiles(selected);
  };

  const handleBatchAnalyze = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error("Please upload at least 2 candidate resumes.");
      return;
    }
    if (!jobDescription.trim()) {
      toast.error("Please enter the target job description.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("job_description", jobDescription);

      const res = await batchAnalyzeResumes(formData);
      if (res.success && res.leaderboard) {
        setLeaderboard(res.leaderboard);
        toast.success(`Screened & Ranked ${res.count} Candidates!`);
      } else {
        toast.error("Batch screening failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error processing batch resumes.");
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (idx) => {
    if (idx === 0) return { icon: "🥇 1st Place", bg: "bg-amber-500/20 text-amber-300 border-amber-500/40" };
    if (idx === 1) return { icon: "🥈 2nd Place", bg: "bg-slate-300/20 text-slate-200 border-slate-400/40" };
    if (idx === 2) return { icon: "🥉 3rd Place", bg: "bg-orange-500/20 text-orange-300 border-orange-500/40" };
    return { icon: `#${idx + 1} Candidate`, bg: "bg-slate-800 text-slate-400 border-slate-700" };
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-xl shadow-lg glow-purple">
            <FaUsers />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Recruiter Mode (Batch Screening)</h2>
            <p className="text-xs text-slate-400">Upload multiple resumes & rank top candidates by ATS compatibility</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold">
          B2B HR Tool
        </span>
      </div>

      <form onSubmit={handleBatchAnalyze} className="space-y-4">
        {/* Upload Box */}
        <div className="border-2 border-dashed border-slate-700 hover:border-purple-500/80 rounded-2xl p-6 text-center transition-all bg-slate-900/60">
          <input
            type="file"
            multiple
            accept=".pdf,.docx"
            onChange={handleFilesChange}
            className="hidden"
            id="batch-upload"
          />
          <label htmlFor="batch-upload" className="cursor-pointer space-y-2 block">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-2xl border border-purple-500/30">
              <FaUpload />
            </div>
            <p className="text-sm font-bold text-white">
              {files.length > 0 ? `${files.length} Resume Files Selected` : "Click to select multiple candidate resumes (.pdf, .docx)"}
            </p>
            <p className="text-xs text-slate-400">Hold Ctrl / Cmd to select 3-5 resumes at once</p>
          </label>

          {files.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-4 pt-4 border-t border-slate-800">
              {files.map((f, i) => (
                <span key={i} className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                  📄 {f.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Target JD */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Target Job Description for Screening</label>
          <textarea
            rows={3}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the target job description to score candidates against..."
            className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm outline-none focus:border-purple-500 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading || files.length === 0}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-500 hover:to-red-500 text-white font-black text-sm shadow-xl shadow-purple-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <FaSpinner className="animate-spin" /> : <FaTrophy />}
          <span>{loading ? "Screening & Ranking Candidates..." : "Run Batch Screening & Generate Leaderboard"}</span>
        </button>
      </form>

      {/* Leaderboard Table Output */}
      {leaderboard.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <FaTrophy className="text-amber-400" /> Candidate Leaderboard Rankings
            </h3>
            <span className="text-xs text-slate-400 font-medium">Sorted by ATS Match Score</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider font-extrabold">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Candidate / File</th>
                  <th className="py-3 px-4">ATS Score</th>
                  <th className="py-3 px-4">Job Match</th>
                  <th className="py-3 px-4">Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {leaderboard.map((cand, idx) => {
                  const badge = getRankBadge(idx);
                  return (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold">
                        <span className={`px-2.5 py-1 rounded-xl border text-[11px] font-bold ${badge.bg}`}>
                          {badge.icon}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-white">{cand.name}</p>
                        <p className="text-[11px] text-slate-400">{cand.filename}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-base font-black text-cyan-400">{cand.ats_score}%</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-base font-black text-emerald-400">{cand.match_percentage}%</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-3 py-1 rounded-full font-bold ${cand.recommendation === 'Hire' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                          {cand.recommendation}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
