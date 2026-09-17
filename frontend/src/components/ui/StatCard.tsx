import React from 'react';
import { motion } from 'framer-motion';

export interface StatCardProps {
  label: string;
  value: number | string;
  subtext?: string;
  icon: React.ReactNode;
  accentColor?: 'blue' | 'emerald' | 'amber' | 'slate';
  isLoading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon,
  accentColor = 'slate',
  isLoading = false,
}) => {
  const iconBgClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300/90 transition-all duration-200 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-500 tracking-tight">{label}</span>
        <div
          className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${iconBgClasses[accentColor]}`}
        >
          {icon}
        </div>
      </div>

      <div>
        {isLoading ? (
          <div className="h-8 w-16 bg-slate-200 animate-pulse rounded-lg my-0.5" />
        ) : (
          <div className="text-2xl font-bold tracking-tight text-slate-900">{value}</div>
        )}
        {subtext && <p className="text-[11px] text-slate-400 mt-1 font-medium">{subtext}</p>}
      </div>
    </motion.div>
  );
};
