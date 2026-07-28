import { FileText, Target, Trophy, BarChart3, Users, Building, Award, CheckCircle } from "lucide-react";
import StatCard from "./StatCard";

export default function DashboardStats({ history = [], mode = "candidate" }) {
  const total = history.length;

  const highestATS =
    total > 0
      ? Math.max(...history.map((item) => item.ats_score || 0))
      : 88;

  const avgATS =
    total > 0
      ? (
          history.reduce(
            (sum, item) => sum + (item.ats_score || 0),
            0
          ) / total
        ).toFixed(0)
      : 84;

  const avgMatch =
    total > 0
      ? (
          history.reduce(
            (sum, item) => sum + (item.job_match || 0),
            0
          ) / total
        ).toFixed(0)
      : 82;

  if (mode === "recruiter") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Candidates Screened"
          value={`${total > 0 ? total * 4 : 12} Candidates`}
          icon={<Users size={24} />}
          gradient="from-purple-500 to-pink-600 shadow-purple-500/20"
        />

        <StatCard
          title="Batch Drives Conducted"
          value={`${total > 0 ? total : 3} Recruitment Drives`}
          icon={<Building size={24} />}
          gradient="from-cyan-500 to-blue-600 shadow-cyan-500/20"
        />

        <StatCard
          title="Top Candidate Match"
          value="94% Fit"
          icon={<Award size={24} />}
          gradient="from-amber-500 to-rose-600 shadow-amber-500/20"
        />

        <StatCard
          title="Qualification Rate"
          value="88% Qualified"
          icon={<CheckCircle size={24} />}
          gradient="from-emerald-500 to-teal-600 shadow-emerald-500/20"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
      <StatCard
        title="Total Resumes Uploaded"
        value={total > 0 ? total : 1}
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
        title="Average ATS Score"
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