import { useRef, useState } from "react";
import { analyzeResume } from "../services/analyzeService";
import { saveHistory } from "../services/historyService";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUpload,
  FaFilePdf,
  FaFileWord,
  FaTrash,
  FaPaperPlane,
  FaSpinner,
  FaCheckCircle,
  FaTimes,
  FaInfoCircle,
  FaMagic,
  FaBriefcase,
} from "react-icons/fa";

const SAMPLE_JOB_DESCRIPTIONS = [
  {
    role: "Full Stack Engineer",
    icon: "💻",
    description: `We are looking for a Full Stack Software Engineer proficient in Python (FastAPI/Django), JavaScript/TypeScript, and React. 
Key Responsibilities:
- Design and build RESTful APIs and modern web user interfaces.
- Work with relational database systems (PostgreSQL/MySQL) and SQL query optimization.
- Implement responsive UI components using modern CSS and state management.
- Write clean, maintainable, and unit-tested code.
Requirements:
- 2+ years of experience with Python, JavaScript, HTML5/CSS3, and SQL.
- Familiarity with Docker, Git version control, and CI/CD pipelines.`
  },
  {
    role: "Data Scientist / AI Engineer",
    icon: "🤖",
    description: `Seeking a Data Scientist / Machine Learning Engineer with strong Python and analytical skills.
Key Responsibilities:
- Build, evaluate, and deploy machine learning models and NLP pipelines.
- Perform exploratory data analysis and feature engineering using Pandas, NumPy, and Scikit-Learn.
- Integrate Generative AI APIs (Gemini, OpenAI) for intelligent text parsing and recommendations.
- Communicate data insights to stakeholders.
Requirements:
- Bachelor's degree in Computer Science, Data Science, or related field.
- Proficiency in Python, SQL, Machine Learning, NLP, and Data Visualization tools.`
  },
  {
    role: "Frontend Developer (React)",
    icon: "🎨",
    description: `Looking for a passionate Frontend Developer skilled in React.js, TailwindCSS, and JavaScript ES6+.
Key Responsibilities:
- Create visually stunning, highly interactive web applications.
- Optimize frontend web performance, lazy loading, and code splitting.
- Collaborate with backend engineers to integrate APIs.
Requirements:
- Deep expertise in React, React Router, HTML, CSS, TailwindCSS, and Framer Motion.
- Experience with web security best practices and state management.`
  }
];

function ResumeUpload({ onAnalysisComplete }) {
  const { user } = useAuth();

  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowedExtensions = [".pdf", ".docx"];
    const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf(".")).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      alert("Only PDF (.pdf) and Word (.docx) files are allowed.");
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      alert("Please select or drop a resume file first.");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Please paste or select a Job Description.");
      return;
    }

    try {
      setLoading(true);
      setStatusMessage("Extracting text & parsing resume structure...");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("job_description", jobDescription);

      setStatusMessage("Running AI analysis & calculating ATS compatibility...");
      const result = await analyzeResume(formData);

      if (!result.success) {
        alert(result.error || "Analysis failed. Please check backend server status.");
        return;
      }

      // Safe saving history
      try {
        await saveHistory({
          user_id: user?.id || "demo-user-123",
          resume_name: file.name,
          ats_score: result.ats?.overall_score || 0,
          job_match: result.matching?.match_percentage || 0,
          recommendation: result.matching?.recommendation || "Unknown",
          overall_rating: result.ai_review?.overall_rating || "Unknown",
          analysis: result,
        });
      } catch (saveErr) {
        console.warn("Save history notification:", saveErr);
      }

      onAnalysisComplete(result);
    } catch (error) {
      console.error(error);
      const isNetErr = error.message === "Network Error" || error.code === "ECONNABORTED";
      alert(
        isNetErr
          ? "Backend is spinning up from free-tier sleep (takes ~30s). Please tap 'Run AI Resume Analysis' again in a few seconds!"
          : (error.response?.data?.detail || error.message || "Analysis failed. Please try again.")
      );
    } finally {
      setLoading(false);
      setStatusMessage("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const ext = droppedFile.name.substring(droppedFile.name.lastIndexOf(".")).toLowerCase();
      if (![".pdf", ".docx"].includes(ext)) {
        alert("Only PDF and DOCX files are allowed.");
        return;
      }
      setFile(droppedFile);
    }
  };

  const getFileIcon = () => {
    if (!file) return null;
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (ext === ".pdf") {
      return <FaFilePdf className="text-red-400" size={32} />;
    }
    return <FaFileWord className="text-blue-400" size={32} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-500/10"
    >
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl shadow-lg shadow-blue-500/30">
            <FaUpload />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Upload & Analyze</h2>
            <p className="text-slate-400 text-sm">Upload resume & match against job description</p>
          </div>
        </div>

        {file && (
          <button
            onClick={removeFile}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center gap-1.5"
          >
            <FaTrash size={12} /> Clear File
          </button>
        )}
      </div>

      {/* File Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all duration-300 ${
          isDragging
            ? "border-blue-500 bg-blue-500/10 scale-[1.01]"
            : file
            ? "border-emerald-500/50 bg-emerald-500/5"
            : "border-slate-700/80 hover:border-blue-500/80 hover:bg-blue-500/5"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />

        {file ? (
          <div className="flex items-center justify-between gap-4 relative z-20">
            <div className="flex items-center gap-4 text-left">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700">
                {getFileIcon()}
              </div>
              <div>
                <p className="font-semibold text-white text-base">{file.name}</p>
                <p className="text-xs text-slate-400">
                  {(file.size / 1024).toFixed(1)} KB • Ready for analysis
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <FaCheckCircle className="text-emerald-400" size={13} />
                  <span className="text-xs text-emerald-400 font-medium">Valid Document</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-3xl mb-3 border border-blue-500/20 shadow-inner">
              📄
            </div>
            <p className="text-base font-semibold text-white">
              Drag & Drop your Resume here
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports <span className="text-blue-400 font-medium">PDF</span> and <span className="text-purple-400 font-medium">DOCX</span> formats
            </p>
          </div>
        )}
      </div>

      {/* Job Description Presets */}
      <div className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <FaBriefcase className="text-blue-400" /> Target Job Description
          </label>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <FaMagic className="text-yellow-400" /> Sample Presets:
          </span>
        </div>

        {/* Sample JD Buttons */}
        <div className="flex flex-wrap gap-2 mb-3">
          {SAMPLE_JOB_DESCRIPTIONS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setJobDescription(preset.description)}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-blue-600/30 text-slate-300 hover:text-white border border-slate-700/80 hover:border-blue-500/50 text-xs font-medium transition-all flex items-center gap-1.5"
            >
              <span>{preset.icon}</span>
              <span>{preset.role}</span>
            </button>
          ))}
        </div>

        <textarea
          rows={5}
          placeholder="Paste job description text here, or click a preset above..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl bg-slate-800/60 border border-slate-700/80 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none text-sm leading-relaxed"
        />

        <div className="flex justify-between mt-1 text-xs text-slate-500">
          <span>{jobDescription.length} characters</span>
          <span>{jobDescription.trim() ? jobDescription.trim().split(/\s+/).length : 0} words</span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleAnalyze}
          disabled={loading || !file}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-base shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" size={20} />
              <span>Analyzing Resume...</span>
            </>
          ) : (
            <>
              <FaPaperPlane size={18} />
              <span>Run AI Resume Analysis</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Loading Progress */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-3"
          >
            <FaSpinner className="animate-spin text-blue-400 flex-shrink-0" size={20} />
            <p className="text-blue-300 text-xs sm:text-sm font-medium">
              {statusMessage || "Processing resume data with Gemini AI..."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ResumeUpload;