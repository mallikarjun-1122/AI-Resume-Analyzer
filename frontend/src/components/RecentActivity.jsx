import { useNavigate } from "react-router-dom";
import { FaEye, FaCalendarAlt, FaHistory } from "react-icons/fa";

export default function RecentActivity({ history = [] }) {
  const navigate = useNavigate();

  if (history.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-10 text-center border border-slate-800">
        <div className="text-5xl mb-3">📄</div>
        <h3 className="text-xl font-bold text-white mb-1">No Recent Activity</h3>
        <p className="text-slate-400 text-xs sm:text-sm">
          Uploaded resume analysis records will be displayed here for instant review.
        </p>
      </div>
    );
  }

  const getRecommendationBadge = (rec) => {
    const val = (rec || "").toLowerCase();
    if (val === "hire") return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    if (val === "consider" || val === "maybe") return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    return "bg-rose-500/20 text-rose-400 border-rose-500/30";
  };

  return (
    <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
      <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <FaHistory />
          </div>
          <h3 className="text-lg font-bold text-white">Recent Analyses</h3>
        </div>

        <button
          onClick={() => navigate("/history")}
          className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          View All ({history.length}) →
        </button>
      </div>

      <div className="divide-y divide-slate-800/60">
        {history.slice(0, 5).map((item) => (
          <div
            key={item.id}
            className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-slate-800/40 transition-colors"
          >
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>📄</span> {item.resume_name}
              </h4>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <FaCalendarAlt size={10} className="text-slate-500" />
                {item.uploaded_at ? new Date(item.uploaded_at).toLocaleString() : "Recent"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold">
                ATS: {item.ats_score || 0}%
              </span>

              <span className="px-3 py-1 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold">
                Match: {item.job_match || 0}%
              </span>

              <span className={`px-3 py-1 rounded-xl border text-xs font-bold ${getRecommendationBadge(item.recommendation)}`}>
                {item.recommendation || "N/A"}
              </span>

              <button
                onClick={() => navigate(`/history/${item.id}`)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all text-xs flex items-center gap-1"
                title="View Full Report"
              >
                <FaEye size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}