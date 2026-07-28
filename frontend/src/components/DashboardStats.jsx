import { FileText, Target, Trophy, BarChart3 } from "lucide-react";
import StatCard from "./StatCard";

export default function DashboardStats({ history = [] }) {
  const total = history.length;

  const highestATS =
    total > 0
      ? Math.max(...history.map((item) => item.ats_score || 0))
      : 0;

  const avgATS =
    total > 0
      ? (
          history.reduce(
            (sum, item) => sum + (item.ats_score || 0),
            0
          ) / total
        ).toFixed(0)
      : 0;

  const avgMatch =
    total > 0
      ? (
          history.reduce(
            (sum, item) => sum + (item.job_match || 0),
            0
          ) / total
        ).toFixed(0)
      : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
      <StatCard
        title="Total Resumes"
        value={total}
        icon={<FileText size={24} />}
        gradient="from-cyan-500 to-blue-600 shadow-cyan-500/20"
      />

      <StatCard
        title="Highest ATS Score"
        value={`${highestATS}%`}
        icon={<Trophy size={24} />}
        gradient="from-emerald-500 to-teal-600 shadow-emerald-500/20"
      />

      <StatCard
        title="Average ATS"
        value={`${avgATS}%`}
        icon={<BarChart3 size={24} />}
        gradient="from-purple-500 to-indigo-600 shadow-purple-500/20"
      />

      <StatCard
        title="Average Job Match"
        value={`${avgMatch}%`}
        icon={<Target size={24} />}
        gradient="from-amber-500 to-rose-600 shadow-amber-500/20"
      />
    </div>
  );
}