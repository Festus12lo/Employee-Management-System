import React from 'react';
import { Search, RotateCcw, ArrowUpDown } from 'lucide-react';
import type { EmployeeFiltersState } from '../../types/employee';

interface EmployeeFiltersProps {
  filters: EmployeeFiltersState;
  onChange: (filters: EmployeeFiltersState) => void;
  onReset: () => void;
  totalCount: number;
}

const DEPARTMENTS = [
  'All',
  'Engineering',
  'IT',
  'Human Resources',
  'Finance',
  'Marketing',
  'Sales',
  'Operations',
];

const STATUSES = ['All', 'Active', 'Inactive', 'On Leave'];

const SORT_OPTIONS = [
  { value: '-created_at', label: 'Recently Added' },
  { value: 'created_at', label: 'Oldest Added' },
  { value: 'full_name', label: 'Name (A–Z)' },
  { value: '-full_name', label: 'Name (Z–A)' },
  { value: '-salary', label: 'Salary (High to Low)' },
  { value: 'salary', label: 'Salary (Low to High)' },
  { value: '-joining_date', label: 'Joining Date (Newest)' },
];

export const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalCount,
}) => {
  const isFiltered =
    filters.search !== '' ||
    filters.department !== 'All' ||
    filters.status !== 'All' ||
    filters.ordering !== '-created_at';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, ID, email, role, or department..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full text-xs sm:text-sm pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-300"
          />
        </div>

        {/* Dropdown Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Department Filter */}
          <select
            value={filters.department}
            onChange={(e) => onChange({ ...filters, department: e.target.value })}
            className="text-xs font-medium rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100 cursor-pointer"
            aria-label="Filter by department"
          >
            <option value="All">All Departments</option>
            {DEPARTMENTS.filter((d) => d !== 'All').map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => onChange({ ...filters, status: e.target.value })}
            className="text-xs font-medium rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100 cursor-pointer"
            aria-label="Filter by status"
          >
            <option value="All">All Statuses</option>
            {STATUSES.filter((s) => s !== 'All').map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          {/* Sorting */}
          <div className="relative flex items-center">
            <select
              value={filters.ordering}
              onChange={(e) => onChange({ ...filters, ordering: e.target.value })}
              className="text-xs font-medium rounded-xl border border-slate-200 bg-white pl-7 pr-3 py-2 text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100 cursor-pointer appearance-none"
              aria-label="Sort employees"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-2 pointer-events-none" />
          </div>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              onClick={onReset}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Reset all filters"
              aria-label="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter summary bar */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
        <div>
          Showing <span className="font-semibold text-slate-800">{totalCount}</span> records
          {isFiltered && <span className="ml-1.5 text-blue-600 font-medium">(Filtered)</span>}
        </div>
        {isFiltered && (
          <button
            onClick={onReset}
            className="text-slate-500 hover:text-slate-800 underline underline-offset-2 cursor-pointer"
          >
            Clear active filters
          </button>
        )}
      </div>
    </div>
  );
};
