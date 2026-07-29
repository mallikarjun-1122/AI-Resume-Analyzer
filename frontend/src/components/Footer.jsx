import {
  FaGithub,
  FaLinkedin,
  FaArrowUp,
  FaHeart,
} from "react-icons/fa";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative bg-slate-950 text-slate-400 pt-16 pb-8 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Logo & Description */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-black text-sm">
              ⚡
            </div>
            <span className="text-xl font-black text-white">
              ResumeAI<span className="text-cyan-400">.io</span>
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Empowering job seekers worldwide with real-time AI resume analysis, ATS scoring, and interview intelligence.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4">
            Navigation
          </h3>

          <ul className="space-y-2 text-xs font-semibold">
            <li><a href="#features" className="hover:text-cyan-400 transition-colors">Features</a></li>
            <li><a href="#how" className="hover:text-cyan-400 transition-colors">How It Works</a></li>
            <li><a href="#faq" className="hover:text-cyan-400 transition-colors">FAQ</a></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4">
            Connect
          </h3>

          <div className="flex gap-4 text-xl">
            <a href="#" className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all">
              <FaGithub />
            </a>
            <a href="#" className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all">
              <FaLinkedin />
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-slate-900 mt-12 pt-6 text-center text-xs text-slate-500 flex flex-wrap justify-between items-center max-w-7xl mx-auto px-6">
        <span>© {new Date().getFullYear()} ResumeAI.io. All rights reserved.</span>
        <span className="flex items-center gap-1">Crafted with <FaHeart className="text-rose-500" /> for job seekers</span>
      </div>

      {/* Floating Scroll Top */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-xl shadow-cyan-500/20 hover:scale-110 transition-all"
      >
        <FaArrowUp />
      </button>
    </footer>
  );
}

export default Footer;