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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition-all shadow-md"
        >
          <FaArrowLeft size={14} /> Back to History
        </button>

        {loading ? (
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-16 text-center text-slate-300">
            <div className="w-12 h-12 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin mx-auto mb-4"></div>
            <p className="font-semibold text-lg">Loading Saved Report...</p>
          </div>
        ) : !analysis ? (
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-16 text-center text-slate-300">
            <h2 className="text-2xl font-bold text-white mb-2">Report Not Found</h2>
            <p className="text-slate-400 text-sm mb-6">The requested history analysis record could not be found.</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold"
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