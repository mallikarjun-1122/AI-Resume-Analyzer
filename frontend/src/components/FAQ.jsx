import { useState } from "react";
import { FaChevronDown, FaChevronUp, FaQuestionCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function FAQ() {
  const faqs = [
    {
      question: "How does the AI Resume Analyzer match resumes with job descriptions?",
      answer:
        "Our engine extracts technical skills, years of experience, and project metrics from your uploaded PDF or DOCX resume. It evaluates these against the target job description using Google Gemini 2.5 AI model intelligence.",
    },
    {
      question: "Which resume file formats are accepted?",
      answer:
        "Currently, PDF (.pdf) and Microsoft Word (.docx) document formats are supported with 100% native text extraction.",
    },
    {
      question: "Is my resume data kept safe and private?",
      answer:
        "Yes, absolutely. Your document and analysis outputs are private to your session and backed up with secure client storage.",
    },
    {
      question: "Can I download my ATS analysis report as a PDF?",
      answer:
        "Yes! After running an analysis, click the 'Download PDF Report' button to export a full report containing scores, matched skills, skill gaps, and interview prep questions.",
    },
    {
      question: "Is there a limit on how many resumes I can scan?",
      answer:
        "No limits! You can run unlimited resume scans, test different job descriptions, and clear or save your history anytime.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="relative py-28 px-4 sm:px-6 bg-slate-950 overflow-hidden border-t border-slate-900"
    >
      <div className="max-w-4xl mx-auto relative z-10 space-y-12">
        <div className="text-center space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-extrabold uppercase tracking-widest">
            ❓ FAQ & Answers
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Frequently Asked <span className="gradient-text-primary">Questions</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Got questions? We've got answers to help you optimize your resume.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="glass-panel glass-panel-hover rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left text-white font-bold text-base sm:text-lg"
                >
                  <span className="flex items-center gap-3">
                    <FaQuestionCircle className="text-cyan-400 flex-shrink-0" />
                    {faq.question}
                  </span>
                  {isOpen ? <FaChevronUp className="text-cyan-400" /> : <FaChevronDown className="text-slate-500" />}
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 text-slate-300 text-sm leading-relaxed border-t border-slate-800/60 pt-4"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FAQ;