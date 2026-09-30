import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import AnalysisResult from "../components/AnalysisResult";
import { getHistoryById } from "../services/historyService";
import { FaArrowLeft } from "react-icons/fa";

function HistoryReport() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, [id]);

  async function loadReport() {
    setLoading(true);
    try {
      const report = await getHistoryById(id);
      if (report && report.analysis) {
        setAnalysis(report.analysis);
      }
    } catch (e) {
      console.error("Error loading report:", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <button
          onClick={() => navigate("/history")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold border border-zinc-800 hover:border-zinc-700 transition-all shadow-md"
        >
          <FaArrowLeft size={12} className="text-green-400" /> Back to History
        </button>

        {loading ? (
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-16 text-center text-zinc-300 space-y-4">
            <div className="w-10 h-10 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="font-bold text-base text-zinc-200">Loading Saved Report...</p>
          </div>
        ) : !analysis ? (
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-16 text-center">
            <h2 className="text-2xl font-black text-white mb-2">Report Not Found</h2>
            <p className="text-zinc-400 text-sm mb-6">The requested history analysis record could not be found.</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-2.5 rounded-xl bg-green-400 hover:bg-green-300 text-black font-black text-xs shadow-lg shadow-green-400/20"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <AnalysisResult result={analysis} />
        )}
      </div>
    </DashboardLayout>
  );
}

export default HistoryReport;