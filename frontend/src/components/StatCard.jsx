import React from "react";

export default function StatCard({
  title,
  value,
  icon,
  gradient = "from-cyan-500 to-blue-600",
}) {
  return (
    <div className="glass-panel glass-panel-hover p-6 rounded-3xl relative overflow-hidden group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 tracking-tight">
            {value}
          </h2>
        </div>

        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
    </div>
  );
}