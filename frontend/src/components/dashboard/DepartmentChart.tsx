import React from 'react';
import type { DepartmentStat } from '../../types/employee';

interface DepartmentChartProps {
  distribution: DepartmentStat[];
  totalEmployees: number;
}

export const DepartmentChart: React.FC<DepartmentChartProps> = ({
  distribution,
  totalEmployees,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Workforce by Department</h3>
          <p className="text-xs text-slate-500">
            Distribution across active units ({totalEmployees} total staff)
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
          {distribution.length} Units
        </span>
      </div>

      {distribution.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400">
          No department data available.
        </div>
      ) : (
        <div className="space-y-3.5">
          {distribution.map((dept) => {
            return (
              <div key={dept.department} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{dept.department}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{dept.count}</span>
                    <span className="text-slate-400 text-[11px]">({dept.percentage}%)</span>
                  </div>
                </div>
                {/* Visual Progress Bar */}
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-slate-900 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${Math.max(dept.percentage, 4)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
