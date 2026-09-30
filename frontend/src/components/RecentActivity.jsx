import { useNavigate } from "react-router-dom";
import { FaEye, FaCalendarAlt, FaHistory } from "react-icons/fa";

export default function RecentActivity({ history = [] }) {
  const navigate = useNavigate();

  if (history.length === 0) {
    return (
      <div className="bg-zinc-950 rounded-3xl p-10 text-center border border-zinc-800 shadow-xl">
        <div className="text-5xl mb-3">📄</div>
        <h3 className="text-xl font-black text-white mb-1">No Recent Activity</h3>
        <p className="text-zinc-400 text-xs sm:text-sm">
          Uploaded resume analysis records will be displayed here for instant review.
        </p>
      </div>
    );
  }

  const getRecommendationBadge = (rec) => {
    const val = (rec || "").toLowerCase();
    if (val === "hire" || val === "fit" || val === "strong hire") return "bg-green-400/20 text-green-300 border border-green-400/40";
    if (val === "consider" || val === "maybe") return "bg-zinc-800 text-zinc-300 border border-zinc-700";
    return "bg-zinc-900 text-zinc-400 border border-zinc-800";
  };

  return (
    <div className="bg-zinc-950 rounded-3xl border border-zinc-800 shadow-xl overflow-hidden">
      <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-green-400/30 text-green-300 flex items-center justify-center">
            <FaHistory />
          </div>
          <h3 className="text-lg font-black text-white">Recent Analyses</h3>
        </div>

        <button
          onClick={() => navigate("/history")}
          className="text-xs font-bold text-green-400 hover:text-green-300 transition-colors"
        >
          View All ({history.length}) →
        </button>
      </div>

      <div className="divide-y divide-zinc-800/60">
        {history.slice(0, 5).map((item) => (
          <div
            key={item.id}
            className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-zinc-900/50 transition-colors"
          >
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <span>📄</span> {item.resume_name}
              </h4>
              <p className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                <FaCalendarAlt size={10} className="text-zinc-500" />
                {item.uploaded_at ? new Date(item.uploaded_at).toLocaleString() : "Recent"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-green-400/10 text-green-300 border border-green-400/30 text-xs font-bold">
                ATS: {item.ats_score || 0}%
              </span>

              <span className="px-3 py-1 rounded-xl bg-zinc-900 text-zinc-300 border border-zinc-800 text-xs font-bold">
                Match: {item.job_match || 0}%
              </span>

              <span className={`px-3 py-1 rounded-xl border text-xs font-bold ${getRecommendationBadge(item.recommendation)}`}>
                {item.recommendation || "Evaluated"}
              </span>

              <button
                onClick={() => navigate(`/history/${item.id}`)}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-all text-xs flex items-center gap-1"
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