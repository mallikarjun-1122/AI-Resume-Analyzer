import DashboardNavbar from "../components/DashboardNavbar";
import Footer from "../components/Footer";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-1/4 w-[35rem] h-[35rem] bg-cyan-500/10 rounded-full blur-[160px] animate-ambient"></div>
        <div className="absolute bottom-10 left-1/4 w-[35rem] h-[35rem] bg-purple-600/10 rounded-full blur-[160px] animate-ambient" style={{ animationDelay: '6s' }}></div>
      </div>

      {/* Grid Mesh Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <DashboardNavbar />

      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default DashboardLayout;