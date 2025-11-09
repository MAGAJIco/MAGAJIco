
import React from "react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  gradient: string;
}

export default function StatCard({ icon, label, value, gradient }: StatCardProps) {
  return (
    <div className={`bg-gradient-to-br ${gradient} p-4 rounded-xl border`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm text-gray-300">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
}
