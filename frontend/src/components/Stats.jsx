import {
  FaRobot,
  FaShieldAlt,
  FaBolt,
  FaLightbulb,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Stats() {
  const navigate = useNavigate();

  const reasons = [
    {
      icon: <FaRobot size={32} className="text-green-400" />,
      title: "AI Powered Analysis",
      description:
        "Explainable ATS rule scoring combined with Gemini 2.5 generative intelligence for resume optimization.",
    },
    {
      icon: <FaShieldAlt size={32} className="text-green-400" />,
      title: "ATS Compatibility",
      description:
        "Deterministic Applicant Tracking System scoring based on strict set-intersection keyword matching.",
    },
    {
      icon: <FaBolt size={32} className="text-green-400" />,
      title: "Instant Results",
      description:
        "Receive transparent ATS scores, missing skills, STAR bullet points, and customized interview probes in seconds.",
    },
    {
      icon: <FaLightbulb size={32} className="text-green-400" />,
      title: "Career Guidance",
      description:
        "Tailored portfolio projects and actionable steps to elevate your technical profile for hiring managers.",
    },
  ];

  return (
    <section className="relative py-28 px-6 bg-black overflow-hidden border-t border-zinc-900">
      {/* Subtle green ambient glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-green-400/5 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-400/5 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <span className="px-3.5 py-1.5 rounded-full bg-green-400/10 border border-green-400/30 text-green-300 text-xs font-extrabold uppercase tracking-widest">
            ⭐ Why Choose ResumeAI
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Built for Serious <span className="text-green-400">Career Advancement</span>
          </h2>

          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
            Designed to help students, developers, and recruiters achieve transparent, ATS-friendly hiring outcomes.
          </p>
        </motion.div>

        {/* Stats/Reasons Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-zinc-950 p-8 rounded-3xl border border-zinc-800 hover:border-green-400/40 relative space-y-4 group transition-all duration-300 shadow-xl"
            >
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-green-400/30 flex items-center justify-center text-green-300 shadow-lg shadow-green-400/10 group-hover:scale-105 transition-transform">
                {item.icon}
              </div>

              <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">
                {item.title}
              </h3>

              <p className="text-zinc-400 text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center pt-4"
        >
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-4 rounded-2xl text-base font-black text-black bg-green-400 hover:bg-green-300 shadow-xl shadow-green-400/20 hover:shadow-green-400/35 transition-all duration-300"
          >
            Start Your Analysis Today
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default Stats;