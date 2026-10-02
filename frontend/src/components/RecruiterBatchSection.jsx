import { useState } from "react";
import {
  FaUsers,
  FaUpload,
  FaTrophy,
  FaSpinner,
  FaCheckCircle,
  FaQuestionCircle,
  FaChevronDown,
  FaChevronUp,
  FaFileAlt,
  FaBriefcase,
  FaGraduationCap
} from "react-icons/fa";
import { batchAnalyzeResumes } from "../services/analyzeService";
import toast from "react-hot-toast";

export default function RecruiterBatchSection() {
  const [files, setFiles] = useState([]);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [expandedCandidate, setExpandedCandidate] = useState(null);

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
        toast.success(`Screened & Ranked ${res.leaderboard.length} Candidates!`);

        // Save batch run stats to localStorage
        try {
          const userKey = (localStorage.getItem("candidate_email") || "default").trim().toLowerCase();
          const storageKey = `recruiter_batch_runs_${userKey}`;
          const raw = localStorage.getItem(storageKey);
          const runs = raw ? JSON.parse(raw) : [];
          const topScore = Math.max(...res.leaderboard.map((c) => c.ats_score ?? 0));
          const qualifiedCount = res.leaderboard.filter(
            (candidate) => candidate.recommendation === "Fit" || candidate.recommendation === "Strong Hire" || (candidate.ats_score ?? 0) >= 70
          ).length;

          runs.unshift({
            id: `batch_${Date.now()}`,
            count: res.leaderboard.length,
            top_score: topScore,
            qualified_count: qualifiedCount,
            timestamp: new Date().toISOString(),
          });
          localStorage.setItem(storageKey, JSON.stringify(runs));
        } catch (saveErr) {
          console.warn("Recruiter stats save warning:", saveErr);
        }
      } else {
        toast.error("Batch screening failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || err.message || "Error processing batch resumes.");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (idx) => {
    setExpandedCandidate(expandedCandidate === idx ? null : idx);
  };

  const getRankBadge = (idx) => {
    if (idx === 0) return { icon: "🥇 1st Place", bg: "bg-green-400/20 text-green-300 border-green-400/40" };
    if (idx === 1) return { icon: "🥈 2nd Place", bg: "bg-zinc-800 text-zinc-200 border-zinc-700" };
    if (idx === 2) return { icon: "🥉 3rd Place", bg: "bg-zinc-900 text-zinc-300 border-zinc-800" };
    return { icon: `#${idx + 1} Candidate`, bg: "bg-zinc-950 text-zinc-400 border-zinc-800" };
  };

  return (
    <div className="bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-zinc-800 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-green-400/30 flex items-center justify-center text-green-300 text-xl shadow-lg shadow-green-400/10">
            <FaUsers />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Recruiter Mode: Fit & Batch Screening</h2>
            <p className="text-xs text-zinc-400">Screen candidate pools & discover transparent reasons why each applicant fits the job</p>
          </div>
        </div>

        <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-green-400/10 text-green-300 border border-green-400/30 text-xs font-extrabold uppercase tracking-wider">
          B2B Hiring Intelligence
        </span>
      </div>

      <form onSubmit={handleBatchAnalyze} className="space-y-4">
        {/* Upload Box */}
        <div className="border-2 border-dashed border-zinc-800 hover:border-green-400/60 rounded-2xl p-6 text-center transition-all bg-zinc-900/50">
          <input
            type="file"
            multiple
            accept=".pdf,.docx"
            onChange={handleFilesChange}
            className="hidden"
            id="batch-upload"
          />
          <label htmlFor="batch-upload" className="cursor-pointer space-y-2 block">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-zinc-900 border border-green-400/30 text-green-300 flex items-center justify-center text-2xl shadow-lg shadow-green-400/10">
              <FaUpload />
            </div>
            <p className="text-sm font-bold text-white">
              {files.length > 0 ? `${files.length} Resume Files Selected` : "Click to select multiple candidate resumes (.pdf, .docx)"}
            </p>
            <p className="text-xs text-zinc-400">Upload 2 or more applicant resumes for multi-criteria ranking</p>
          </label>

          {files.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-4 pt-4 border-t border-zinc-800">
              {files.map((f, i) => (
                <span key={i} className="px-3 py-1 rounded-xl bg-zinc-900 text-zinc-300 text-xs font-medium border border-zinc-800 flex items-center gap-1.5">
                  <FaFileAlt className="text-green-400 text-[10px]" /> {f.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Target JD */}
        <div>
          <label className="block text-xs font-bold text-zinc-300 mb-1.5">Target Job Description for Screening & Fit Analysis</label>
          <textarea
            rows={3}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste target job requirements (e.g. required tech stack, years of experience, qualifications)..."
            className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm outline-none focus:border-green-400 transition-colors resize-none placeholder-zinc-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading || files.length === 0}
          className="w-full py-4 rounded-2xl bg-green-400 hover:bg-green-300 text-black font-black text-sm shadow-xl shadow-green-400/20 hover:shadow-green-400/35 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <FaSpinner className="animate-spin" /> : <FaTrophy />}
          <span>{loading ? "Screening & Analyzing Fit Across Candidates..." : "Run Batch Screening & Generate Fit Leaderboard"}</span>
        </button>
      </form>

      {/* Leaderboard Output */}
      {leaderboard.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <FaTrophy className="text-green-400" /> Candidate Fit Leaderboard
              </h3>
              <p className="text-xs text-zinc-400">Ranked by ATS skill compatibility, experience depth, and verified job requirements</p>
            </div>
            <span className="text-xs text-green-400 font-bold bg-green-400/10 border border-green-400/20 px-3 py-1 rounded-full self-start sm:self-auto">
              {leaderboard.length} Candidates Evaluated
            </span>
          </div>

          <div className="space-y-4">
            {leaderboard.map((cand, idx) => {
              const badge = getRankBadge(idx);
              const isExpanded = expandedCandidate === idx;
              const matchedSkills = cand.matched_skills || cand.matching_keywords || [];
              const missingSkills = cand.missing_skills || cand.missing_keywords || [];
              const fitReason = cand.fit_reason || cand.summary || "High alignment with core job description requirements.";
              const strengths = cand.key_strengths || [
                `Matches ${matchedSkills.length} core JD skills`,
                `ATS Match Score: ${cand.ats_score}%`,
                "Strong candidate profile"
              ];

              return (
                <div
                  key={idx}
                  className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all space-y-4"
                >
                  {/* Candidate Header Row */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-3">
                      <span className={`px-3 py-1 rounded-xl border text-xs font-black ${badge.bg}`}>
                        {badge.icon}
                      </span>
                      <div>
                        <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                          {cand.name || cand.candidate_name}
                          <span className="text-xs font-medium text-zinc-400">({cand.filename})</span>
                        </h4>
                        <p className="text-xs text-zinc-400">{cand.email && cand.email !== "N/A" ? cand.email : "Resume candidate"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-start md:self-auto">
                      <div className="text-right">
                        <span className="text-xs text-zinc-400 block font-medium">ATS Match</span>
                        <span className="text-lg font-black text-green-400">{cand.ats_score}%</span>
                      </div>
                      <div className="h-8 w-[1px] bg-zinc-800"></div>
                      <div className="text-right">
                        <span className="text-xs text-zinc-400 block font-medium">Rank Score</span>
                        <span className="text-lg font-black text-white">{cand.rank_score || cand.match_percentage}%</span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-xl text-xs font-bold border ml-2 ${
                          cand.recommendation === "Strong Hire" || cand.fit_level === "High Fit" || cand.recommendation === "Fit"
                            ? "bg-green-400/20 text-green-300 border-green-400/40"
                            : "bg-zinc-800 text-zinc-300 border-zinc-700"
                        }`}
                      >
                        {cand.fit_level || cand.recommendation}
                      </span>
                    </div>
                  </div>

                  {/* WHY FIT FOR JOB - Primary Callout Box */}
                  <div className="bg-black/70 border border-green-400/30 rounded-xl p-4 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-green-400">
                      <FaCheckCircle />
                      <span>Why This Candidate Fits The Job:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium">
                      {fitReason}
                    </p>

                    {/* Matched Skills Pills */}
                    {matchedSkills.length > 0 && (
                      <div className="pt-1.5 flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold text-zinc-400 mr-1">Matching Skills:</span>
                        {matchedSkills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2.5 py-0.5 rounded-full bg-green-400/10 text-green-300 border border-green-400/30 text-[11px] font-semibold"
                          >
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Expand / Collapse Details Button */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => toggleExpand(idx)}
                      className="text-xs font-bold text-zinc-300 hover:text-green-400 flex items-center gap-1.5 transition-colors"
                    >
                      <span>{isExpanded ? "Hide Recruiter Breakdown" : "Inspect Detailed Fit Breakdown & Interview Probe"}</span>
                      {isExpanded ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
                    </button>

                    <span className="text-[11px] text-zinc-500 font-medium">
                      {matchedSkills.length} matches • {missingSkills.length} gaps
                    </span>
                  </div>

                  {/* Expanded Breakdown */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-zinc-800/80 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Key Strengths */}
                        <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-3.5 space-y-2">
                          <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                            <FaBriefcase className="text-green-400" /> Key Candidate Strengths
                          </h5>
                          <ul className="space-y-1.5">
                            {strengths.map((str, sIdx) => (
                              <li key={sIdx} className="text-xs text-zinc-300 flex items-start gap-2">
                                <span className="text-green-400 font-bold">•</span>
                                <span>{str}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Skill Gaps to Verify */}
                        <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-3.5 space-y-2">
                          <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                            <FaGraduationCap className="text-zinc-400" /> Skill Gaps to Probe
                          </h5>
                          {missingSkills.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {missingSkills.map((gap, gIdx) => (
                                <span
                                  key={gIdx}
                                  className="px-2.5 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800 text-[11px]"
                                >
                                  ? {gap}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-green-400 font-semibold pt-1">
                              ✓ No major core skill gaps identified against JD
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Recruiter Interview Probe */}
                      {cand.interview_probe && (
                        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 flex items-start gap-2.5">
                          <FaQuestionCircle className="text-green-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-xs font-bold text-white block">Suggested Technical Screening Question:</span>
                            <span className="text-xs text-zinc-300 font-medium italic">"{cand.interview_probe}"</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

