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
      icon: <FaBrain size={28} className="text-cyan-400" />,
      title: "AI Resume Analysis",
      description:
        "Deep learning scan of your resume against target roles to extract section strengths, clarity score, and bullet point impact.",
      badge: "Gemini 2.5 Powered",
      color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30"
    },
    {
      icon: <FaChartBar size={28} className="text-emerald-400" />,
      title: "Real-time ATS Compatibility",
      description:
        "Instant Applicant Tracking System score break-downs measuring keyword match percentage, section structure, and readability.",
      badge: "98% Accuracy",
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30"
    },
    {
      icon: <FaRobot size={28} className="text-purple-400" />,
      title: "Missing Skill Gap Finder",
      description:
        "Identifies crucial hard and soft technical skills present in the job description that are missing from your resume.",
      badge: "Skill Matcher",
      color: "from-purple-500/20 to-pink-500/20 border-purple-500/30"
    },
    {
      icon: <FaProjectDiagram size={28} className="text-amber-400" />,
      title: "Recommended Projects",
      description:
        "Tailored portfolio project recommendations designed to bridge missing experience gaps for target roles.",
      badge: "Portfolio Boost",
      color: "from-amber-500/20 to-orange-500/20 border-amber-500/30"
    },
    {
      icon: <FaCheckCircle size={28} className="text-blue-400" />,
      title: "Interview Prep Q&A",
      description:
        "AI-generated technical and behavioral interview questions tailored specifically to your resume and the target JD.",
      badge: "Interview Ready",
      color: "from-blue-500/20 to-indigo-500/20 border-blue-500/30"
    },
    {
      icon: <FaFilePdf size={28} className="text-rose-400" />,
      title: "Instant PDF Report Export",
      description:
        "Export comprehensive ATS report cards with 1-click to share with mentors or review offline.",
      badge: "1-Click PDF",
      color: "from-rose-500/20 to-pink-500/20 border-rose-500/30"
    }
  ];

  return (
    <section
      id="features"
      className="relative py-28 px-4 sm:px-6 bg-slate-950 overflow-hidden"
    >
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-extrabold uppercase tracking-widest">
            ⚡ Powerful Intelligence
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Engineered to Help You <span className="gradient-text-primary">Land More Interviews</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Everything you need to optimize your resume, pass automated ATS screeners, and ace technical interviews.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-panel glass-panel-hover p-8 rounded-3xl space-y-4 relative group"
            >
              <div className="flex items-center justify-between">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center border shadow-lg`}>
                  {feature.icon}
                </div>
                <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 uppercase tracking-wider">
                  {feature.badge}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                {feature.title}
              </h3>

              <p className="text-slate-400 text-sm leading-relaxed">
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