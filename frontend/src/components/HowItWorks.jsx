import {
  FaUser,
  FaUpload,
  FaBriefcase,
  FaRobot,
  FaArrowRight,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function HowItWorks() {
  const steps = [
    {
      icon: <FaUpload size={24} className="text-green-400" />,
      title: "1. Upload Resume",
      description:
        "Upload your PDF or DOCX resume. Our parser instantly extracts work history, skills, and projects.",
    },
    {
      icon: <FaBriefcase size={24} className="text-green-400" />,
      title: "2. Paste Job Description",
      description:
        "Select a 1-click sample preset or paste the target job requirements from any job listing.",
    },
    {
      icon: <FaRobot size={24} className="text-green-400" />,
      title: "3. Run ATS Engine",
      description:
        "Deterministic scoring calculates keyword compatibility and identifies missing critical competencies.",
    },
    {
      icon: <FaUser size={24} className="text-green-400" />,
      title: "4. Get Report & Export",
      description:
        "Review tailored interview Q&A, actionable resume bullet fixes, and download your report card as a PDF.",
    },
  ];

  return (
    <section 
      id="how" 
      className="relative py-28 px-4 sm:px-6 bg-black overflow-hidden border-t border-zinc-900"
    >
      <div className="max-w-7xl mx-auto relative z-10 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-green-400/10 border border-green-400/30 text-green-300 text-xs font-extrabold uppercase tracking-widest">
            🔄 Simple 4-Step Process
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            How <span className="text-green-400">ResumeAI Works</span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
            Get recruiter-ready in under 60 seconds with our automated ATS optimization workflow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-zinc-950 p-8 rounded-3xl border border-zinc-800 hover:border-green-400/40 relative space-y-4 group transition-all duration-300 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-green-400/30 flex items-center justify-center text-green-300 shadow-lg shadow-green-400/10">
                  {step.icon}
                </div>
                <span className="text-3xl font-black text-zinc-700 group-hover:text-green-400/40 transition-colors">
                  0{index + 1}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">
                {step.title}
              </h3>

              <p className="text-zinc-400 text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center pt-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-black text-black bg-green-400 hover:bg-green-300 shadow-xl shadow-green-400/20 hover:shadow-green-400/35 transition-all duration-300"
          >
            <span>Start Free Analysis</span>
            <FaArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;