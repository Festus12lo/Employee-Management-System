import React from 'react';
import { Eye, Edit2, Trash2, Mail, Calendar, DollarSign } from 'lucide-react';
import type { Employee } from '../../types/employee';
import { Badge } from '../ui/Badge';

interface EmployeeTableProps {
  employees: Employee[];
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="w-full">
      {/* Desktop Table View (Hidden on mobile) */}
      <div className="hidden md:block overflow-hidden bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th scope="col" className="py-3 px-4">Employee</th>
                <th scope="col" className="py-3 px-4">Department</th>
                <th scope="col" className="py-3 px-4">Designation</th>
                <th scope="col" className="py-3 px-4">Email</th>
                <th scope="col" className="py-3 px-4">Salary</th>
                <th scope="col" className="py-3 px-4">Status</th>
                <th scope="col" className="py-3 px-4">Joining Date</th>
                <th scope="col" className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {employees.map((emp) => {
                const initials = emp.full_name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2);

                const formattedSalary = new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0,
                }).format(Number(emp.salary || 0));

                return (
                  <tr
                    key={emp.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => onView(emp)}
                  >
                    {/* Employee Identity Column */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-medium text-xs flex items-center justify-center shrink-0">
                          {initials}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {emp.full_name}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400">
                            {emp.employee_id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {emp.department}
                    </td>

                    {/* Designation */}
                    <td className="py-3 px-4 text-slate-600">
                      {emp.designation}
                    </td>

                    {/* Email */}
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {emp.email}
                    </td>

                    {/* Salary */}
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {formattedSalary}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <Badge status={emp.status} size="sm" />
                    </td>

                    {/* Joining Date */}
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {emp.joining_date}
                    </td>

                    {/* Actions Menu */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onView(emp)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="View Details"
                          aria-label={`View details for ${emp.full_name}`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEdit(emp)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit Employee"
                          aria-label={`Edit ${emp.full_name}`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(emp)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Employee"
                          aria-label={`Delete ${emp.full_name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card Layout (Visible on small screens) */}
      <div className="md:hidden space-y-3">
        {employees.map((emp) => {
          const initials = emp.full_name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

          const formattedSalary = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
          }).format(Number(emp.salary || 0));

          return (
            <div
              key={emp.id}
              onClick={() => onView(emp)}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:border-slate-300 transition-all cursor-pointer space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-semibold text-xs flex items-center justify-center shrink-0">
                    {initials}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{emp.full_name}</h3>
                    <p className="text-[11px] font-mono text-slate-400">
                      {emp.employee_id} • {emp.department}
                    </p>
                  </div>
                </div>
                <Badge status={emp.status} size="sm" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1 border-t border-slate-100">
                <div className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{emp.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-800">{formattedSalary}</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2 text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Joined {emp.joining_date} • {emp.designation}</span>
                </div>
              </div>

              <div
                className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => onView(emp)}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  View
                </button>
                <button
                  type="button"
                  onClick={() => onEdit(emp)}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(emp)}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
