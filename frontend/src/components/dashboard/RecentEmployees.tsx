import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, UserPlus } from 'lucide-react';
import type { Employee } from '../../types/employee';
import { Badge } from '../ui/Badge';

interface RecentEmployeesProps {
  employees: Employee[];
  onView: (emp: Employee) => void;
}

export const RecentEmployees: React.FC<RecentEmployeesProps> = ({ employees, onView }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Recent Onboardings</h3>
            <p className="text-xs text-slate-500">Latest employee additions to the system</p>
          </div>
          <Link
            to="/employees"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {employees.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No recent employees recorded.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {employees.map((emp) => {
              const initials = emp.full_name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);

              return (
                <div
                  key={emp.id}
                  onClick={() => onView(emp)}
                  className="py-3 flex items-center justify-between hover:bg-slate-50/60 -mx-2 px-2 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-medium text-xs flex items-center justify-center shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {emp.full_name}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono truncate">
                        {emp.employee_id} • {emp.department}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                      {emp.joining_date}
                    </span>
                    <Badge status={emp.status} size="sm" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100 mt-2">
        <Link
          to="/employees"
          className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Manage Workforce Directory</span>
        </Link>
      </div>
    </div>
  );
};
