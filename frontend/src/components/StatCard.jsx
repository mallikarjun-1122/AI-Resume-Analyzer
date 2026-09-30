import React from "react";

export default function StatCard({
  title,
  value,
  icon,
}) {
  return (
    <div className="bg-zinc-950 border border-zinc-800 hover:border-green-400/40 p-6 rounded-3xl relative overflow-hidden group transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-zinc-400">
            {title}
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 tracking-tight">
            {value}
          </h2>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-green-400/30 flex items-center justify-center text-green-400 shadow-lg shadow-green-400/10 group-hover:scale-110 group-hover:border-green-400 transition-all duration-300">
          {icon}
        </div>
      </div>
    </div>
  );
}