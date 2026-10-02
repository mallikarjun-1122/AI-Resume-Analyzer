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
      const userKey = (localStorage.getItem("candidate_email") || "default").trim().toLowerCase();
      const raw = localStorage.getItem(`recruiter_batch_runs_${userKey}`);
      const runs = raw ? JSON.parse(raw) : [];
      if (runs.length > 0) {
        const totalScreened = runs.reduce((sum, r) => sum + (r.count || 0), 0);
        const topMatch = Math.max(...runs.map((r) => r.top_score || 0));
        const qualified = runs.reduce((sum, r) => sum + (r.qualified_count ?? 0), 0);
        const qualificationRate = totalScreened > 0
          ? Math.round((qualified / totalScreened) * 100)
          : 0;

        setRecruiterStats({
          candidatesScreened: totalScreened,
          drivesConducted: runs.length,
          topMatch: topMatch,
          qualificationRate,
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
        />

        <StatCard
          title="Batch Drives Conducted"
          value={`${recruiterStats.drivesConducted} Drives`}
          icon={<Building size={24} />}
        />

        <StatCard
          title="Top Candidate Match"
          value={`${recruiterStats.topMatch}% Fit`}
          icon={<Award size={24} />}
        />

        <StatCard
          title="Qualification Rate"
          value={`${recruiterStats.qualificationRate}% Qualified`}
          icon={<CheckCircle size={24} />}
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
      />

      <StatCard
        title="Highest ATS Score"
        value={`${highestATS}%`}
        icon={<Trophy size={24} />}
      />

      <StatCard
        title="Average ATS Score"
        value={`${avgATS}%`}
        icon={<BarChart3 size={24} />}
      />

      <StatCard
        title="Average Job Match"
        value={`${avgMatch}%`}
        icon={<Target size={24} />}
      />
    </div>
  );
}
