import { Link } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes, FaRocket, FaMagic } from "react-icons/fa";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-panel border-b border-slate-800/80 shadow-2xl shadow-cyan-950/20">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 h-20">
        {/* Brand Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-3 group"
          onClick={closeMenu}
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-all duration-300">
            ⚡
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black gradient-text-primary tracking-tight">
              ResumeAI<span className="text-cyan-400">.io</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest -mt-1 hidden sm:block">
              AI ATS Intelligence
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
          <a 
            href="#features" 
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-200"
          >
            Features
          </a>
          <a 
            href="#how" 
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-200"
          >
            How It Works
          </a>
          <a 
            href="#faq" 
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-200"
          >
            FAQ
          </a>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-200 border border-slate-800"
          >
            Sign In
          </Link>

          <Link
            to="/dashboard"
            className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all duration-300 flex items-center gap-2"
          >
            <FaRocket className="text-cyan-200" /> Launch Analyzer
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-panel border-t border-slate-800 px-4 py-6 space-y-3">
          <a
            href="#features"
            className="block px-4 py-3 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800/80 transition-all"
            onClick={closeMenu}
          >
            Features
          </a>
          <a
            href="#how"
            className="block px-4 py-3 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800/80 transition-all"
            onClick={closeMenu}
          >
            How It Works
          </a>
          <a
            href="#faq"
            className="block px-4 py-3 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800/80 transition-all"
            onClick={closeMenu}
          >
            FAQ
          </a>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            <Link
              to="/login"
              className="block w-full text-center px-4 py-3 rounded-xl text-sm font-bold text-slate-200 bg-slate-900 border border-slate-800"
              onClick={closeMenu}
            >
              Sign In
            </Link>
            <Link
              to="/dashboard"
              className="block w-full text-center px-4 py-3 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/20"
              onClick={closeMenu}
            >
              Launch Analyzer 🚀
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;