import {
  FaFilePdf,
  FaChartBar,
  FaProjectDiagram,
  FaBrain,
  FaCheckCircle,
  FaRobot,
} from "react-icons/fa";

function Features() {
  const features = [
    {
      icon: <FaBrain size={24} className="text-green-400" />,
      title: "AI Resume Analysis",
      description:
        "Explainable ATS rule scoring combined with Gemini 2.5 generative intelligence for resume optimization.",
      badge: "Gemini 2.5 AI",
    },
    {
      icon: <FaChartBar size={24} className="text-green-400" />,
      title: "Deterministic ATS Scoring",
      description:
        "Transparent Applicant Tracking System score breakdown based on strict set-intersection keyword matching.",
      badge: "Explainable ATS",
    },
    {
      icon: <FaRobot size={24} className="text-green-400" />,
      title: "Skill Gap Detection",
      description:
        "Identifies crucial hard and soft technical skills present in the job description that are missing from your resume.",
      badge: "Skill Matcher",
    },
    {
      icon: <FaProjectDiagram size={24} className="text-green-400" />,
      title: "Recommended Projects",
      description:
        "Tailored portfolio project recommendations designed to bridge missing experience gaps for target roles.",
      badge: "Portfolio Boost",
    },
    {
      icon: <FaCheckCircle size={24} className="text-green-400" />,
      title: "Interview Prep Q&A",
      description:
        "AI-generated technical and behavioral interview questions tailored specifically to your resume and target JD.",
      badge: "Interview Ready",
    },
    {
      icon: <FaFilePdf size={24} className="text-green-400" />,
      title: "Instant PDF Report Export",
      description:
        "Export comprehensive ATS audit report cards with 1-click to review offline or share with mentors.",
      badge: "1-Click PDF",
    }
  ];

  return (
    <section
      id="features"
      className="relative py-28 px-4 sm:px-6 bg-black overflow-hidden border-t border-zinc-900"
    >
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-green-400/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-emerald-400/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-green-400/10 border border-green-400/30 text-green-300 text-xs font-extrabold uppercase tracking-widest">
            ⚡ Powerful Intelligence
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Engineered to Help You <span className="text-green-400">Land More Interviews</span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
            Everything you need to optimize your resume, pass automated ATS screeners, and ace technical interviews.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-zinc-950 p-8 rounded-3xl border border-zinc-800 hover:border-green-400/40 space-y-4 relative group transition-all duration-300 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-green-400/30 flex items-center justify-center text-green-300 shadow-lg shadow-green-400/10">
                  {feature.icon}
                </div>
                <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800 uppercase tracking-wider">
                  {feature.badge}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">
                {feature.title}
              </h3>

              <p className="text-zinc-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
