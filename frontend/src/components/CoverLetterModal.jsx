import { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelopeOpenText, FaTimes, FaCopy, FaCheck, FaSpinner, FaDownload } from "react-icons/fa";
import { generateCoverLetter } from "../services/analyzeService";
import toast from "react-hot-toast";

export default function CoverLetterModal({ isOpen, onClose, defaultJd = "" }) {
  const [jobDescription, setJobDescription] = useState(defaultJd);
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      toast.error("Please paste the job description.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("resume_name", "Candidate Resume");
      formData.append("job_description", jobDescription);

      const res = await generateCoverLetter(formData);
      if (res.success && res.cover_letter) {
        setCoverLetter(res.cover_letter);
        toast.success("AI Cover Letter Generated!");
      } else {
        toast.error("Cover letter generation failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || err.message || "Error generating cover letter.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    toast.success("Cover letter copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([coverLetter], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `Cover_Letter_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
            <FaEnvelopeOpenText />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">1-Click AI Cover Letter</h2>
            <p className="text-xs text-zinc-400">Generate a 3-paragraph customized application letter</p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">Target Job Description</label>
            <textarea
              rows={4}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job description text here..."
              className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm outline-none focus:border-green-400 transition-colors resize-none placeholder-zinc-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-green-400 hover:bg-green-300 text-black font-black text-sm shadow-xl shadow-green-400/20 hover:shadow-green-400/35 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaEnvelopeOpenText />}
            <span>{loading ? "Writing Cover Letter with AI..." : "Generate AI Cover Letter"}</span>
          </button>
        </form>

        {coverLetter && (
          <div className="mt-8 space-y-4 pt-6 border-t border-zinc-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-green-400 uppercase tracking-wider">
                ✉️ Generated Cover Letter
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  {copied ? <FaCheck className="text-green-400" /> : <FaCopy />}
                  {copied ? "Copied" : "Copy"}
                </button>

                <button
                  onClick={handleDownload}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 text-green-300 border border-green-400/30 text-xs font-bold flex items-center gap-1.5 hover:bg-zinc-800 transition-all"
                >
                  <FaDownload /> Download TXT
                </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs sm:text-sm text-zinc-200 leading-relaxed space-y-3 whitespace-pre-line font-serif">
              {coverLetter}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
