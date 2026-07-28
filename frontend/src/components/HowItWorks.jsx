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
      icon: <FaUpload size={28} className="text-cyan-400" />,
      title: "1. Upload Resume",
      description:
        "Drop your PDF or DOCX resume document. Our parser instantly extracts work history, skills, and projects.",
      color: "from-cyan-500 to-blue-600",
    },
    {
      icon: <FaBriefcase size={28} className="text-blue-400" />,
      title: "2. Paste Job Description",
      description:
        "Select a 1-click sample preset or paste the target job requirements from LinkedIn, Indeed, or company sites.",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: <FaRobot size={28} className="text-purple-400" />,
      title: "3. Run AI Scan",
      description:
        "Gemini AI compares keyword matches, calculates section completeness, and detects missing critical skills.",
      color: "from-indigo-500 to-purple-600",
    },
    {
      icon: <FaUser size={28} className="text-emerald-400" />,
      title: "4. Get Report & Export",
      description:
        "Review tailored interview Q&A, actionable resume fixes, and download your complete report card as a PDF.",
      color: "from-purple-500 to-emerald-500",
    },
  ];

  return (
    <section 
      id="how" 
      className="relative py-28 px-4 sm:px-6 bg-slate-950 overflow-hidden border-t border-slate-900"
    >
      <div className="max-w-7xl mx-auto relative z-10 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-extrabold uppercase tracking-widest">
            🔄 Simple 4-Step Process
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            How <span className="gradient-text-sunset">ResumeAI Works</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Get recruiter-ready in under 60 seconds with our automated AI workflow.
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
              className="glass-panel glass-panel-hover p-8 rounded-3xl relative space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg`}>
                  {step.icon}
                </div>
                <span className="text-3xl font-black text-slate-800 group-hover:text-cyan-500/40 transition-colors">
                  0{index + 1}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                {step.title}
              </h3>

              <p className="text-slate-400 text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center pt-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-extrabold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all duration-300"
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