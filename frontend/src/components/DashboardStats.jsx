import { FileText, Target, Trophy, BarChart3, Users, Building, Award, CheckCircle } from "lucide-react";
import StatCard from "./StatCard";
import { useEffect, useState } from "react";

export default function DashboardStats({ history = [], mode = "candidate" }) {
  const [recruiterStats, setRecruiterStats] = useState({
    candidatesScreened: 0,
    drivesConducted: 0,
    topMatch: 0,
    qualificationRate: 0,
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("recruiter_batch_runs");
      const runs = raw ? JSON.parse(raw) : [];
      if (runs.length > 0) {
        const totalScreened = runs.reduce((sum, r) => sum + (r.count || 0), 0);
        const topMatch = Math.max(...runs.map((r) => r.top_score || 0));
        const avgQual = Math.round(runs.reduce((sum, r) => sum + (r.qual_rate || 80), 0) / runs.length);

        setRecruiterStats({
          candidatesScreened: totalScreened,
          drivesConducted: runs.length,
          topMatch: topMatch,
          qualificationRate: avgQual,
        });
      } else {
        setRecruiterStats({
          candidatesScreened: 0,
          drivesConducted: 0,
          topMatch: 0,
          qualificationRate: 0,
        });
      }
    } catch (e) {
      setRecruiterStats({
        candidatesScreened: 0,
        drivesConducted: 0,
        topMatch: 0,
        qualificationRate: 0,
      });
    }
  }, [mode]);

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

  if (mode === "recruiter") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Candidates Screened"
          value={`${recruiterStats.candidatesScreened} Candidates`}
          icon={<Users size={24} />}
          gradient="from-purple-500 to-pink-600 shadow-purple-500/20"
        />

        <StatCard
          title="Batch Drives Conducted"
          value={`${recruiterStats.drivesConducted} Drives`}
          icon={<Building size={24} />}
          gradient="from-cyan-500 to-blue-600 shadow-cyan-500/20"
        />

        <StatCard
          title="Top Candidate Match"
          value={`${recruiterStats.topMatch}% Fit`}
          icon={<Award size={24} />}
          gradient="from-amber-500 to-rose-600 shadow-amber-500/20"
        />

        <StatCard
          title="Qualification Rate"
          value={`${recruiterStats.qualificationRate}% Qualified`}
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