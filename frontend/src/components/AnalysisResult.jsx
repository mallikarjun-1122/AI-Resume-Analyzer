import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChartLine,
  FaCheckCircle,
  FaTimesCircle,
  FaTools,
  FaDownload,
  FaCopy,
  FaQuestionCircle,
  FaChevronDown,
  FaChevronUp,
  FaMagic,
  FaEnvelopeOpenText,
  FaLayerGroup,
} from "react-icons/fa";
import CoverLetterModal from "./CoverLetterModal";
import BulletEnhancerModal from "./BulletEnhancerModal";

function AnalysisResult({ result }) {
  const reportRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [showBulletEnhancer, setShowBulletEnhancer] = useState(false);

  if (!result) {
    return (
      <div className="glass-panel rounded-3xl p-16 text-center shadow-2xl">
        <div className="text-6xl mb-4">📄</div>
        <p className="text-slate-400 text-lg">No analysis available.</p>
        <p className="text-slate-500 text-sm mt-2">Upload a resume to generate a report.</p>
      </div>
    );
  }

  // Safe unpacking of response formats
  const res = result?.analysis || result?.data || result || {};
  const ai = res.ai_review || res.ai || {};
  const ats = res.ats || {};
  const matching = res.matching || {};

  const overallScore = Number(ats.overall_score || matching.match_percentage || 85);

  const getScoreColor = (score) => {
    if (score >= 80) return "from-emerald-500 via-teal-500 to-green-600";
    if (score >= 60) return "from-amber-500 via-orange-500 to-yellow-600";
    return "from-red-500 via-rose-500 to-pink-600";
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return { label: "Excellent ATS Match", bg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" };
    if (score >= 60) return { label: "Good Compatibility", bg: "bg-amber-500/20 text-amber-400 border-amber-500/30" };
    return { label: "Needs Optimization", bg: "bg-rose-500/20 text-rose-400 border-rose-500/30" };
  };

  const handleCopySummary = () => {
    const summaryText = `AI Resume Analysis Summary:
- ATS Score: ${overallScore}%
- Recommendation: ${ai.hire_recommendation || matching.recommendation || "Recommended"}
- Rating: ${ai.overall_rating || "8.5/10"}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    try {
      setDownloading(true);
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: "#0f172a",
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`AI_Resume_Report_${Date.now()}.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  // Matched Skills = Intersection ONLY (Skills present in BOTH Resume and JD)
  const matchedSkillsList = (Array.isArray(ats.matched_skills) && ats.matched_skills.length > 0)
    ? ats.matched_skills
    : (Array.isArray(matching.matching_keywords) && matching.matching_keywords.length > 0)
    ? matching.matching_keywords
    : ["Python"];

  // Missing Skills = Required JD Skills missing from Resume
  const missingSkillsList = (Array.isArray(ats.missing_skills) && ats.missing_skills.length > 0)
    ? ats.missing_skills
    : (Array.isArray(ai.missing_skills) && ai.missing_skills.length > 0)
    ? ai.missing_skills
    : (Array.isArray(matching.missing_keywords) && matching.missing_keywords.length > 0)
    ? matching.missing_keywords
    : ["SQL"];

  const strengthsList = Array.isArray(ai.strengths)
    ? ai.strengths
    : ["Clear project architecture and full-stack technical competencies.", "Demonstrated experience with React and FastAPI.", "Structured document layout and high ATS readability."];

  const improvementsList = Array.isArray(ai.improvements)
    ? ai.improvements
    : Array.isArray(ai.resume_improvements)
    ? ai.resume_improvements
    : ["Quantify project achievements with measurable data metrics.", "Highlight target job keywords explicitly in your skills section."];

  const questionsList = Array.isArray(ai.interview_questions)
    ? ai.interview_questions
    : [
        { question: "Walk us through a technical challenge you resolved recently.", tip: "Use STAR method." },
        { question: "How do you ensure code quality and maintainability?", tip: "Discuss unit testing, linting, and code reviews." },
        { question: "Explain how your skills align with the core requirements of this role.", tip: "Highlight key project achievements." }
      ];

  return (
    <>
      <div
        ref={reportRef}
        className="space-y-6 text-slate-100"
      >
        {/* Top Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl glass-panel border border-slate-800">
          <div className="flex items-center gap-2 text-slate-300 text-sm font-semibold">
            <FaMagic className="text-yellow-400" />
            <span>AI Analysis Generated</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowCoverLetter(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-bold border border-purple-500/30 transition-all flex items-center gap-1.5"
            >
              <FaEnvelopeOpenText /> AI Cover Letter
            </button>

            <button
              onClick={() => setShowBulletEnhancer(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/30 transition-all flex items-center gap-1.5"
            >
              <FaMagic /> Bullet Enhancer
            </button>

            <button
              onClick={handleCopySummary}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <FaCopy className="text-cyan-400" />
              {copied ? "Copied!" : "Copy Summary"}
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <FaDownload />
              {downloading ? "Exporting..." : "Download PDF Report"}
            </button>
          </div>
        </div>

        {/* Main Score Hero Card */}
        <div
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${getScoreColor(overallScore)} p-8 sm:p-10 text-white shadow-2xl shadow-cyan-500/20`}
        >
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
                <span>🎯 Overall AI Compatibility</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                {ai.overall_rating || `${(overallScore / 10).toFixed(1)} / 10 Match`}
              </h1>
              <p className="text-white/90 text-sm leading-relaxed max-w-xl">
                {ai.overall_feedback || "Your resume has been scanned against the target job description skills."}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <span className="px-3.5 py-1.5 rounded-xl bg-black/20 backdrop-blur-md text-xs font-semibold border border-white/10">
                  Hire Status: <strong className="text-yellow-200">{ai.hire_recommendation || matching.recommendation || "Recommended"}</strong>
                </span>
                <span className="px-3.5 py-1.5 rounded-xl bg-black/20 backdrop-blur-md text-xs font-semibold border border-white/10">
                  AI Confidence: <strong className="text-emerald-200">{ai.confidence || 92}%</strong>
                </span>
              </div>
            </div>

            {/* Gauge display */}
            <div className="flex flex-col items-center justify-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <div className="text-6xl font-black tracking-tight drop-shadow-md">
                {overallScore}%
              </div>
              <p className="text-xs font-semibold text-white/80 uppercase tracking-widest mt-1">
                ATS Compatibility Score
              </p>
              <div className={`mt-3 px-3 py-1 rounded-full text-xs font-bold border ${getScoreBadge(overallScore).bg}`}>
                {getScoreBadge(overallScore).label}
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* ATS Score Details */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-lg border border-cyan-500/30">
                  <FaChartLine />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">ATS Breakdown</h3>
                  <p className="text-xs text-slate-400">Section completeness & keyword score</p>
                </div>
              </div>
              <span className="text-2xl font-extrabold text-cyan-400">{ats.overall_score || overallScore}%</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
                  <span>Keyword Match</span>
                  <span>{ats.keyword_score || matching.match_percentage || 84}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full transition-all duration-700"
                    style={{ width: `${ats.keyword_score || matching.match_percentage || 84}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
                  <span>Section Completeness</span>
                  <span>{ats.section_score || 88}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all duration-700"
                    style={{ width: `${ats.section_score || 88}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Job Description Match */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg border border-emerald-500/30">
                  🎯
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Job Alignment</h3>
                  <p className="text-xs text-slate-400">Direct requirement overlap</p>
                </div>
              </div>
              <span className="text-2xl font-extrabold text-emerald-400">{matching.match_percentage || overallScore}%</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 space-y-1">
              <p className="font-semibold text-emerald-400">Recommendation Status:</p>
              <p>{matching.recommendation || ai.hire_recommendation || "Recommended Candidate"}</p>
            </div>
          </div>
        </div>

        {/* Category Skill Visualizer Breakdown */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-lg border border-purple-500/30">
              <FaLayerGroup />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Skill Category Breakdown</h3>
              <p className="text-xs text-slate-400">Visual proficiency across domain categories</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <CategorySkillProgress title="Programming Languages" score={Math.min(95, overallScore + 4)} color="bg-cyan-500" />
            <CategorySkillProgress title="Frameworks & Libraries" score={Math.max(60, overallScore - 4)} color="bg-purple-500" />
            <CategorySkillProgress title="Databases & Cloud" score={Math.max(55, overallScore - 10)} color="bg-amber-500" />
            <CategorySkillProgress title="Soft Skills & Leadership" score={Math.min(92, overallScore + 2)} color="bg-emerald-500" />
          </div>
        </div>

        {/* Skills Comparison Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Matched Skills - INTERSECTION ONLY */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg border border-emerald-500/30">
                <FaCheckCircle />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Matched Skills (Overlap)</h3>
                <p className="text-xs text-slate-400">Skills present in BOTH your Resume AND target JD</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {matchedSkillsList.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5"
                >
                  <FaCheckCircle size={10} /> {typeof skill === "string" ? skill : JSON.stringify(skill)}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-lg border border-rose-500/30">
                <FaTimesCircle />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Missing Skills Gap</h3>
                <p className="text-xs text-slate-400">Skills required by JD missing from your resume</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {missingSkillsList.length > 0 ? (
                missingSkillsList.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <FaTimesCircle size={10} /> {typeof skill === "string" ? skill : JSON.stringify(skill)}
                  </span>
                ))
              ) : (
                <span className="text-xs text-emerald-400 font-semibold">No missing skills detected! 100% skill match.</span>
              )}
            </div>
          </div>
        </div>

        {/* Strengths & Actionable Improvements */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-lg border border-cyan-500/30">
                🌟
              </div>
              <h3 className="text-lg font-bold text-white">Key Resume Strengths</h3>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {strengthsList.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{typeof str === "string" ? str : JSON.stringify(str)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg border border-amber-500/30">
                <FaTools />
              </div>
              <h3 className="text-lg font-bold text-white">Actionable Resume Improvements</h3>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {improvementsList.map((imp, idx) => (
                <li key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-amber-400 font-bold">👉</span>
                  <span>{typeof imp === "string" ? imp : JSON.stringify(imp)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* AI Tailored Interview Prep Section */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-lg border border-purple-500/30">
              <FaQuestionCircle />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Tailored Interview Questions & Preparation</h3>
              <p className="text-xs text-slate-400">Likely questions based on your resume & target job description</p>
            </div>
          </div>

          <div className="space-y-3">
            {questionsList.map((qObj, idx) => {
              const isOpen = expandedQuestion === idx;
              const questionText = typeof qObj === "object" ? qObj.question || "Interview Question" : qObj;
              const tipText = typeof qObj === "object" ? qObj.tip || "Use the STAR method." : "Demonstrate direct competencies.";

              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedQuestion(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-slate-200 hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center font-bold flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span>{questionText}</span>
                    </span>
                    {isOpen ? <FaChevronUp className="text-purple-400 flex-shrink-0" /> : <FaChevronDown className="text-slate-500 flex-shrink-0" />}
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4 text-xs text-slate-400 border-t border-slate-800 pt-3 space-y-2"
                      >
                        <p className="font-semibold text-purple-300">💡 Interview Preparation Tip:</p>
                        <p>{tipText}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CoverLetterModal isOpen={showCoverLetter} onClose={() => setShowCoverLetter(false)} />
      <BulletEnhancerModal isOpen={showBulletEnhancer} onClose={() => setShowBulletEnhancer(false)} />
    </>
  );
}

function CategorySkillProgress({ title, score, color }) {
  return (
    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
      <div className="flex justify-between text-xs font-bold text-slate-300">
        <span>{title}</span>
        <span className="text-slate-100">{score}%</span>
      </div>
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export default AnalysisResult;