import { Link } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes, FaUserPlus } from "react-icons/fa";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/85 backdrop-blur-xl border-b border-zinc-800 shadow-2xl shadow-green-950/20">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 h-20">
        {/* Brand Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-3 group"
          onClick={closeMenu}
        >
          <div className="w-11 h-11 rounded-2xl bg-zinc-900 border border-green-400/30 flex items-center justify-center text-green-300 font-extrabold text-lg shadow-lg shadow-green-400/10 group-hover:scale-105 group-hover:border-green-400 transition-all duration-300">
            ⚡
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
              ResumeAI<span className="text-green-400">.io</span>
            </span>
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest -mt-1 hidden sm:block">
              Intelligent ATS Engine
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1 bg-zinc-900/80 p-1.5 rounded-2xl border border-zinc-800">
          <a 
            href="#features" 
            className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all duration-200"
          >
            Features
          </a>
          <a 
            href="#how" 
            className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all duration-200"
          >
            How It Works
          </a>
          <a 
            href="#faq" 
            className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all duration-200"
          >
            FAQ
          </a>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-900 transition-all duration-200 border border-zinc-800 hover:border-zinc-700"
          >
            Sign In
          </Link>

          <Link
            to="/register"
            className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-black bg-green-400 hover:bg-green-300 shadow-lg shadow-green-400/20 hover:shadow-green-400/35 transition-all duration-300 flex items-center gap-2"
          >
            <FaUserPlus className="text-black" /> Register
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-zinc-950 border-t border-zinc-800 px-4 py-6 space-y-3">
          <a
            href="#features"
            className="block px-4 py-3 rounded-xl text-sm font-semibold text-zinc-200 hover:bg-zinc-900 transition-all"
            onClick={closeMenu}
          >
            Features
          </a>
          <a
            href="#how"
            className="block px-4 py-3 rounded-xl text-sm font-semibold text-zinc-200 hover:bg-zinc-900 transition-all"
            onClick={closeMenu}
          >
            How It Works
          </a>
          <a
            href="#faq"
            className="block px-4 py-3 rounded-xl text-sm font-semibold text-zinc-200 hover:bg-zinc-900 transition-all"
            onClick={closeMenu}
          >
            FAQ
          </a>

          <div className="pt-4 border-t border-zinc-800 space-y-2">
            <Link
              to="/login"
              className="block w-full text-center px-4 py-3 rounded-xl text-sm font-bold text-zinc-200 bg-zinc-900 border border-zinc-800"
              onClick={closeMenu}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="block w-full text-center px-4 py-3 rounded-xl text-sm font-extrabold text-black bg-green-400 hover:bg-green-300 shadow-lg shadow-green-400/20"
              onClick={closeMenu}
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;